const { createApp } = Vue;

/* ─── helpers ─── */

function flat(arr) {
  return arr.reduce((a, b) => a.concat(b), []);
}

function uniq(arr) {
  return [...new Set(arr)];
}

function stripHtml(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent || '';
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderMarkdown(markdown) {
  const lines = markdown.trim().split('\n');
  const output = [];
  let inOrderedList = false;

  const closeOrderedList = () => {
    if (!inOrderedList) return;
    output.push('</ol>');
    inOrderedList = false;
  };

  const inline = (text) => escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>');

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      closeOrderedList();
      continue;
    }

    if (line.startsWith('## ')) {
      closeOrderedList();
      output.push(`<h3>${inline(line.slice(3))}</h3>`);
      continue;
    }

    const orderedItem = line.match(/^\d+\.\s+(.+)$/);
    if (orderedItem) {
      if (!inOrderedList) {
        output.push('<ol>');
        inOrderedList = true;
      }
      output.push(`<li>${inline(orderedItem[1])}</li>`);
      continue;
    }

    closeOrderedList();
    output.push(`<p>${inline(line)}</p>`);
  }

  closeOrderedList();
  return output.join('');
}

/* ─── Note Center ─── */

const NoteCenter = {
  template: `
    <div class="note-view">
      <h1 class="view-title">笔记中心</h1>
      <p class="view-sub">跨产品 · 跨技术栈 · 跨语言 的个人使用心得与经验</p>

      <div class="filter-bar">
        <div class="filter-row">
          <span class="filter-label">产品</span>
          <div class="filter-tags">
            <button
              v-for="p in products" :key="p"
              class="filter-tag" :class="{ on: isOn('product', p) }"
              @click="toggle('product', p)"
            >{{ p }}</button>
          </div>
        </div>
        <div class="filter-row">
          <span class="filter-label">技术栈</span>
          <div class="filter-tags">
            <button
              v-for="s in stacks" :key="s"
              class="filter-tag" :class="{ on: isOn('stack', s) }"
              @click="toggle('stack', s)"
            >{{ s }}</button>
          </div>
        </div>
        <div class="filter-row">
          <span class="filter-label">语言</span>
          <div class="filter-tags">
            <button
              v-for="l in langs" :key="l"
              class="filter-tag" :class="{ on: isOn('lang', l) }"
              @click="toggle('lang', l)"
            >{{ l }}</button>
          </div>
        </div>
        <div class="filter-row">
          <span class="filter-label">类型</span>
          <div class="filter-tags">
            <button
              v-for="t in types" :key="t"
              class="filter-tag" :class="{ on: isOn('type', t) }"
              @click="toggle('type', t)"
            >{{ t }}</button>
          </div>
          <button class="filter-clear" @click="clearAll">清空筛选</button>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="empty-state">没有匹配的笔记，试试减少筛选条件</div>

      <div class="note-list">
        <button
          v-for="n in filtered" :key="n.id"
          class="note-card"
          @click="openNote(n)"
        >
          <div class="note-card-title">{{ n.title }}</div>
          <div class="note-card-meta">{{ n.product }} · {{ n.date }}</div>
          <div class="note-tags">
            <span class="note-tag type">{{ n.type }}</span>
            <span class="note-tag" v-for="s in n.stacks" :key="s">{{ s }}</span>
            <span class="note-tag" v-for="l in n.langs" :key="l">{{ l }}</span>
          </div>
        </button>
      </div>

      <div v-if="selected" class="note-detail">
        <div class="note-detail-header">
          <span class="note-detail-title">{{ selected.title }}</span>
          <button class="note-detail-close" @click="closeNote" aria-label="关闭">✕</button>
        </div>
        <div class="note-detail-meta">
          <span class="note-tag type">{{ selected.type }}</span>
          <span class="note-tag">{{ selected.product }}</span>
          <span class="note-tag" v-for="s in selected.stacks" :key="s">{{ s }}</span>
          <span class="note-tag" v-for="l in selected.langs" :key="l">{{ l }}</span>
          <span class="note-tag">{{ selected.date }}</span>
        </div>
        <div class="note-detail-body" v-html="selected.body"></div>
        <div class="note-links" v-if="selected.links && selected.links.length">
          <a
            v-for="(lk, i) in selected.links" :key="i"
            class="note-link" :href="lk.url" target="_blank" rel="noopener"
          >↗ {{ lk.title }}</a>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      query: '',
      sel: { product: [], stack: [], lang: [], type: [] },
      selected: null
    };
  },
  computed: {
    products() { return uniq(notes.map(n => n.product)).sort(); },
    stacks() { return uniq(flat(notes.map(n => n.stacks))).sort(); },
    langs() { return uniq(flat(notes.map(n => n.langs))).sort(); },
    types() { return uniq(notes.map(n => n.type)).sort(); },
    filtered() {
      const q = this.query.trim().toLowerCase();
      return notes.filter(n => {
        if (this.sel.product.length && !this.sel.product.includes(n.product)) return false;
        if (this.sel.stack.length && !n.stacks.some(s => this.sel.stack.includes(s))) return false;
        if (this.sel.lang.length && !n.langs.some(l => this.sel.lang.includes(l))) return false;
        if (this.sel.type.length && !this.sel.type.includes(n.type)) return false;
        if (q) {
          const hay = (n.title + ' ' + stripHtml(n.body)).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      }).sort((a, b) => b.date.localeCompare(a.date));
    }
  },
  methods: {
    toggle(dim, val) {
      const a = this.sel[dim];
      const i = a.indexOf(val);
      if (i >= 0) a.splice(i, 1);
      else a.push(val);
      this.selected = null;
    },
    isOn(dim, val) {
      return this.sel[dim].includes(val);
    },
    clearAll() {
      this.sel = { product: [], stack: [], lang: [], type: [] };
      this.query = '';
    },
    openNote(n) {
      this.selected = n;
    },
    closeNote() {
      this.selected = null;
    }
  }
};

/* ─── Pricing Matrix ─── */

const PricingMatrix = {
  template: `
    <div class="pricing-view">
      <h1 class="view-title">价格矩阵</h1>
      <p class="view-sub">当前所有 coding plan 与模型 API 的价格对比</p>

      <div class="pricing-meta">
        价格核对于 <strong>{{ meta.updatedAt }}</strong> · {{ meta.note }}
      </div>

      <div class="price-section" v-for="g in grouped" :key="g.track">
        <div class="price-section-title">{{ g.track }}</div>
        <div class="table-wrap">
          <table class="pricing-table">
            <thead>
              <tr>
                <th>产品</th>
                <th>厂商</th>
                <th>方案</th>
                <th>价格</th>
                <th>计费</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in g.items" :key="p.product + p.plan + i">
                <td class="pt-name">
                  <a v-if="linkFor(p.product)" :href="linkFor(p.product)" target="_blank" rel="noopener" class="pt-link">{{ p.product }} <span class="pt-ext">↗</span></a>
                  <span v-else>{{ p.product }}</span>
                </td>
                <td>{{ p.vendor }}</td>
                <td>{{ p.plan }}</td>
                <td class="pt-price" :class="priceClass(p)">{{ p.price }}</td>
                <td>{{ p.billing }}</td>
                <td class="pt-note">{{ p.note }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      pricings: pricings,
      meta: pricingMeta,
      links: pricingLinks
    };
  },
  computed: {
    grouped() {
      const map = {};
      for (const p of this.pricings) {
        if (!map[p.track]) map[p.track] = [];
        map[p.track].push(p);
      }
      return Object.entries(map).map(([track, items]) => ({ track, items }));
    }
  },
  methods: {
    linkFor(product) {
      return this.links[product] || '';
    },
    priceClass(p) {
      if (p.price === '¥0' || p.price === '免费' || p.price === '$0') return 'price-free';
      if (p.price === '待确认' || p.price === '按量') return 'price-unknown';
      return 'price-paid';
    }
  }
};

/* ─── Operating System Guide ─── */

const OperatingSystemGuide = {
  template: `
    <div class="os-view">
      <header class="os-hero">
        <div>
          <p class="os-eyebrow">Computer Science · Learning Path</p>
          <h1 class="view-title">{{ guide.title }}</h1>
          <p class="view-sub">{{ guide.subtitle }}</p>
        </div>
        <div class="os-hero-mark" aria-hidden="true">OS</div>
      </header>

      <nav class="os-section-nav" aria-label="操作系统章节">
        <button
          v-for="section in guide.sections"
          :key="section.id"
          class="os-section-tab"
          :class="{ active: activeSection === section.id }"
          @click="selectSection(section.id)"
        >
          <span>{{ section.number }}</span>
          <strong>{{ section.title }}</strong>
        </button>
      </nav>

      <article class="os-chapter" :key="current.id">
        <header class="os-chapter-header">
          <div class="os-chapter-number">{{ current.number }}</div>
          <div>
            <h2>{{ current.title }}</h2>
            <p>{{ current.summary }}</p>
          </div>
        </header>

        <div class="os-takeaway"><span>本章主线</span>{{ current.takeaway }}</div>

        <div v-if="current.groups" class="os-accordion-sections">
          <section v-for="group in current.groups" :key="group.id" class="os-accordion-section">
            <h3 class="os-accordion-section-title">{{ group.title }}</h3>
            <div class="os-accordion-list">
              <article v-for="card in group.cards" :key="card.id" class="os-accordion-card">
                <button
                  class="os-accordion-trigger"
                  :aria-expanded="isCardOpen(group.id, card.id)"
                  @click="toggleCard(group.id, card.id)"
                >
                  <span>{{ card.title }}</span>
                  <span class="os-accordion-chevron" aria-hidden="true">⌄</span>
                </button>
                <div
                  v-show="isCardOpen(group.id, card.id)"
                  class="os-markdown-body"
                  v-html="renderCardMarkdown(card.markdown)"
                ></div>
              </article>
            </div>
          </section>
        </div>
        <div v-else class="os-content" v-html="current.body"></div>

        <footer class="os-chapter-actions">
          <button @click="move(-1)" :disabled="currentIndex === 0">← 上一章</button>
          <span>{{ currentIndex + 1 }} / {{ guide.sections.length }}</span>
          <button @click="move(1)" :disabled="currentIndex === guide.sections.length - 1">下一章 →</button>
        </footer>
      </article>
    </div>
  `,
  data() {
    return {
      guide: osGuide,
      activeSection: osGuide.sections[0].id,
      openCards: {}
    };
  },
  computed: {
    currentIndex() {
      return this.guide.sections.findIndex(s => s.id === this.activeSection);
    },
    current() {
      return this.guide.sections[this.currentIndex] || this.guide.sections[0];
    }
  },
  methods: {
    renderCardMarkdown(markdown) {
      return renderMarkdown(markdown);
    },
    isCardOpen(groupId, cardId) {
      return this.openCards[groupId] === cardId;
    },
    toggleCard(groupId, cardId) {
      this.openCards[groupId] = this.isCardOpen(groupId, cardId) ? null : cardId;
    },
    selectSection(id) {
      this.activeSection = id;
      document.querySelector('.main-area')?.scrollTo({ top: 0, behavior: 'smooth' });
    },
    move(offset) {
      const next = this.guide.sections[this.currentIndex + offset];
      if (next) this.selectSection(next.id);
    }
  }
};

/* ─── App ─── */

const app = createApp({
  data() {
    return {
      tabs: [
        { id: 'notes', title: '笔记中心', icon: '📒' },
        { id: 'pricing', title: '价格矩阵', icon: '💲' },
        { id: 'os', title: '操作系统', icon: '⚙️' }
      ],
      activeTab: 'os',
      sidebarOpen: false
    };
  },
  methods: {
    switchTab(id) {
      this.activeTab = id;
      if (window.innerWidth < 720) this.sidebarOpen = false;
    }
  },
  watch: {
    sidebarOpen(val) {
      document.body.style.overflow = val ? 'hidden' : '';
    }
  },
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.sidebarOpen = false;
    });
  }
});

app.component('note-center', NoteCenter);
app.component('pricing-matrix', PricingMatrix);
app.component('operating-system-guide', OperatingSystemGuide);
app.mount('#app');
