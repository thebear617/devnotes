import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modelsPath = path.join(root, 'src/data/models.js');
const openRouterUrl = 'https://openrouter.ai/api/v1/models';
const dataLearnerUrl = 'https://www.datalearner.com/api/v4/ai-resources/pretrained-models';
const dataLearnerSearchUrl = 'https://www.datalearner.com/api/v4/ai-resources/pretrained-models/search';
const concurrency = 8;
const useHuggingFace = process.argv.includes('--huggingface') && !process.argv.includes('--skip-huggingface');
const includeProvider = process.argv.find(argument => argument.startsWith('--include-provider='))?.split('=')[1] || '';
const openRouterFile = process.argv.find(argument => argument.startsWith('--openrouter-file='))?.split('=').slice(1).join('=');
const dataLearnerFile = process.argv.find(argument => argument.startsWith('--datalearner-file='))?.split('=').slice(1).join('=');
const skipDataLearner = process.argv.includes('--skip-datalearner');
const onlyArgument = process.argv.find(argument => argument.startsWith('--only='));
const onlyIds = new Set((onlyArgument?.split('=').slice(1).join('=') || '').split(',').map(id => id.trim()).filter(Boolean));

const { models } = await import(`file://${modelsPath}`);
const openRouter = openRouterFile
  ? JSON.parse(await fs.readFile(path.resolve(openRouterFile), 'utf8'))
  : await fetch(openRouterUrl).then(assertResponse).then(response => response.json());
const openRouterById = new Map(openRouter.data.map(model => [model.id, model]));

async function fetchDataLearnerModels() {
  if (skipDataLearner) return [];
  if (dataLearnerFile) return JSON.parse(await fs.readFile(path.resolve(dataLearnerFile), 'utf8')).models || [];
  if (onlyIds.size) {
    const responses = await Promise.all([...targetModels].map(model => {
      const query = encodeURIComponent(model.name || model.id.split('/').pop());
      return fetch(`${dataLearnerSearchUrl}?query=${query}&releaseStatus=0&locale=zh-CN`).then(assertResponse).then(response => response.json());
    }));
    return responses.flatMap(response => response.models || []);
  }
  const pageSize = 48;
  const first = await fetch(`${dataLearnerUrl}?page=1&pageSize=${pageSize}&releaseStatus=0&locale=zh-CN`).then(assertResponse).then(response => response.json());
  const pages = Array.from({ length: Math.max(0, (first.pagination?.totalPages || 1) - 1) }, (_, index) => index + 2);
  const rest = await Promise.all(pages.map(page => fetch(`${dataLearnerUrl}?page=${page}&pageSize=${pageSize}&releaseStatus=0&locale=zh-CN`).then(assertResponse).then(response => response.json())));
  return [first, ...rest].flatMap(response => response.models || []);
}

function assertResponse(response) {
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response;
}

function parseParameterText(description = '') {
  const text = description.replace(/,/g, '');
  const active = text.match(/(\d+(?:\.\d+)?[BMT])\s*(?:active|activated|激活)\s*parameters?/i);
  const total = text.match(/(?:out of|of)\s*(\d+(?:\.\d+)?[BMT])\s*(?:total|总参数)/i)
    || text.match(/(\d+(?:\.\d+)?[BMT])\s*total\s*parameters?/i)
    || text.match(/(\d+(?:\.\d+)?[BMT])\s*[- ]parameter(?:s)?\b/i);
  return {
    params: total?.[1] || null,
    activeParams: active?.[1] || null,
    source: 'OpenRouter description',
    confidence: total ? 'medium' : null,
  };
}

function normalizeModelCode(value = '') {
  return value.toLowerCase().replace(/:free$/, '').replace(/[^a-z0-9]+/g, '');
}

function formatParamsB(value) {
  if (value == null || Number(value) <= 0) return '';
  const number = Number(value);
  if (number >= 1000) return `${(number / 1000).toFixed(number % 1000 === 0 ? 0 : 1).replace(/\.0$/, '')}T`;
  return `${number.toFixed(number % 1 === 0 ? 0 : 1).replace(/\.0$/, '')}B`;
}

function findDataLearnerModel(model, dataLearnerModels) {
  const localCode = model.id.split('/').pop();
  const candidates = [localCode, model.name, localCode.replace(/\./g, '-'), localCode.replace(/\./g, '-').replace(/-preview$/, '')];
  const normalized = candidates.map(normalizeModelCode);
  return dataLearnerModels.find(remote => normalized.includes(normalizeModelCode(remote.model_code)))
    || dataLearnerModels.find(remote => normalized.includes(normalizeModelCode(remote.model_abbr_name)) || normalizeModelCode(remote.model_abbr_name).includes(normalized[0]));
}

const parameterOverrides = {
  'moonshotai/kimi-k3': { params: '2.8T', activeParams: '50B', architecture: 'MoE', source: 'DataLearner Kimi K3 model page', confidence: 'medium' },
  'minimax/minimax-m1': { params: '456B', activeParams: '45.9B', source: 'MiniMax official M1 model card', confidence: 'high' },
  'minimax/minimax-m2': { params: '230B', activeParams: '10B', source: 'OpenRouter description / MiniMax M2 paper', confidence: 'high' },
  'minimax/minimax-m2.1': { params: '230B', activeParams: '10B', source: 'MiniMax official API model docs', confidence: 'high' },
  'minimax/minimax-m2.5': { params: '230B', activeParams: '10B', source: 'NVIDIA NIM model card / Hugging Face model card', confidence: 'high' },
  'minimax/minimax-01': { params: '456B', activeParams: '45.9B', source: 'MiniMax official MiniMax-01 paper', confidence: 'high' },
  'minimax/minimax-m3': { params: '428B', activeParams: '23B', source: 'MiniMax M3 model metadata', confidence: 'high' },
  'minimax/minimax-m2.7': { params: '229B', activeParams: '10B', source: '用户提供的 MiniMax-M2.7 资料', confidence: 'high' },
};

function remoteModelToLocal(remote) {
  const parsed = parseParameterText(remote.description);
  const override = parameterOverrides[remote.id];
  const prompt = Number(remote.pricing?.prompt || 0) * 1e6;
  const completion = Number(remote.pricing?.completion || 0) * 1e6;
  return {
    id: remote.id,
    name: remote.name.replace(/^MiniMax:\s*/, ''),
    provider: 'MiniMax',
    architecture: 'MoE',
    params: override?.params || parsed.params || '',
    activeParams: override?.activeParams || parsed.activeParams || null,
    contextLength: remote.context_length || 0,
    inputPrice: prompt,
    outputPrice: completion,
    knowledgeCutoff: remote.knowledge_cutoff || '',
    hasVision: remote.architecture?.input_modalities?.some(modality => ['image', 'video'].includes(modality)) || false,
    hasTools: remote.supported_parameters?.includes('tools') || false,
    hasReasoning: remote.supported_parameters?.includes('reasoning') || /reasoning|thinking/i.test(remote.description || ''),
    codingScore: null,
    paramSource: override?.source || (parsed.params ? parsed.source : null),
    paramConfidence: override?.confidence || parsed.confidence || null,
  };
}

async function enrichFromHuggingFace(model, openRouterModel) {
  const hfId = openRouterModel?.hugging_face_id;
  if (!hfId) return {};
  try {
    const info = await fetch(`https://huggingface.co/api/models/${hfId}`).then(assertResponse).then(response => response.json());
    const parameters = info.safetensors?.parameters || info.parameters;
    if (!parameters) return {};
    return {
      params: `${(parameters / 1e9).toFixed(parameters >= 1e11 ? 0 : 1).replace(/\.0$/, '')}B`,
      paramSource: `Hugging Face: ${hfId}`,
      paramConfidence: 'high',
    };
  } catch (error) {
    console.warn(`Hugging Face lookup failed for ${model.id}: ${error.message}`);
    return {};
  }
}

const targetModels = onlyIds.size ? models.filter(model => onlyIds.has(model.id)) : models;
const dataLearnerModels = await fetchDataLearnerModels();
const dataLearnerMatches = new Map();

const processed = [];
for (let index = 0; index < targetModels.length; index += concurrency) {
  const batch = targetModels.slice(index, index + concurrency);
  processed.push(...await Promise.all(batch.map(async model => {
    const remote = openRouterById.get(model.id);
    const description = parseParameterText(remote?.description);
    const hf = useHuggingFace ? await enrichFromHuggingFace(model, remote) : {};
    const override = parameterOverrides[model.id];
    const dataLearner = findDataLearnerModel(model, dataLearnerModels);
    if (dataLearner) dataLearnerMatches.set(model.id, dataLearner);
    const dataParams = formatParamsB(dataLearner?.totalParamsB);
    const dataActiveParams = formatParamsB(dataLearner?.activeParamsB);
    const params = dataParams || hf.params || override?.params || description.params || model.params || '';
    return {
      ...model,
      architecture: model.architecture || (dataActiveParams && dataParams && dataActiveParams !== dataParams ? 'MoE' : '') || override?.architecture || (model.provider === 'MiniMax' ? 'MoE' : ''),
      params,
      activeParams: dataActiveParams || hf.activeParams || override?.activeParams || model.activeParams || description.activeParams || null,
      paramSource: dataParams ? 'DataLearner API' : hf.paramSource || override?.source || (description.params ? description.source : model.paramSource || null),
      paramConfidence: dataParams ? 'medium' : hf.paramConfidence || override?.confidence || (description.params ? description.confidence : model.paramConfidence || null),
    };
  })));
  console.log(`Processed ${Math.min(index + concurrency, targetModels.length)}/${targetModels.length}`);
}

if (onlyIds.size) {
  const processedById = new Map(processed.map(model => [model.id, model]));
  for (const id of onlyIds) {
    if (!processedById.has(id)) console.warn(`Model not found locally: ${id}`);
  }
}

const processedById = new Map(processed.map(model => [model.id, model]));
const enriched = models.map(model => processedById.get(model.id) || model);

if (includeProvider) {
  const existingIds = new Set(enriched.map(model => model.id));
  const additional = openRouter.data
    .filter(model => model.id.startsWith(`${includeProvider}/`) && !existingIds.has(model.id))
    .map(remoteModelToLocal);
  enriched.push(...additional);
  console.log(`Added ${additional.length} new ${includeProvider} models`);
}

const output = `// AI 模型排行榜数据\n// 来源：OpenRouter Models API + DataLearner API + Hugging Face model metadata\n// 更新时间：${new Date().toISOString().slice(0, 10)}\n\nexport const models = ${JSON.stringify(enriched, null, 2)};\n`;
await fs.writeFile(modelsPath, output);

const stats = enriched.reduce((result, model) => {
  const key = model.paramConfidence || 'unknown';
  result[key] = (result[key] || 0) + 1;
  return result;
}, {});
console.log('Parameter coverage:', stats);
