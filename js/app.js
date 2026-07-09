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

/* ─── App ─── */

const app = createApp({
  data() {
    return {
      tabs: [
        { id: 'notes', title: '笔记中心', icon: '📒' },
        { id: 'pricing', title: '价格矩阵', icon: '💲' }
      ],
      activeTab: 'pricing',
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
app.mount('#app');
