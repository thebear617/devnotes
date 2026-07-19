export const osGuide = {
  title: '操作系统入门',
  subtitle: '从身边正在运行的应用出发，逐步理解操作系统怎样组织软件与硬件',
  sections: [
    {
      id: 'concepts',
      number: '01',
      title: '基本概念',
      summary: '按小节阅读操作系统的基础概念，点击卡片标题展开 Markdown 内容。',
      takeaway: '操作系统位于应用与硬件之间：向上提供简单统一的能力，向下管理并保护真实资源。',
      groups: [
        {
          id: 'os-overview',
          title: '认识操作系统',
          cards: [
            {
              id: 'os-definition',
              title: '操作系统是什么',
              markdown: `## 操作系统是什么

1. 操作系统是一组长期运行的系统软件，位于**应用程序与计算机硬件之间**。
2. 操作系统负责管理硬件资源，同时为应用提供稳定、统一且受保护的运行环境。
3. macOS、Windows、Linux、Android 和 iOS 都是操作系统。`
            },
            {
              id: 'os-role',
              title: '操作系统的作用',
              markdown: `## 操作系统的作用

1. 操作系统负责控制和管理整个计算机系统的资源，并进行合理组织、调度和分配。
2. 操作系统封装隐藏了很多底层细节，通过标准接口以供调用，大大简化了上层应用软件的开发。
3. 操作系统为用户提供了良好的界面和接口，方便用户对计算机进行使用。
4. 操作系统提供了很多辅助性的工具和功能，让用户可以更好地掌控计算机的运行状态。`
            }
          ]
        },
        {
          id: 'os-functions',
          title: '操作系统的核心功能',
          cards: [
            { id: 'process-management', title: '进程与线程管理', markdown: `## 进程与线程管理

1. 创建、暂停和结束进程与线程。
2. 通过调度决定哪个线程下一刻使用 CPU。
3. 关键词：调度、上下文切换。` },
            { id: 'memory-management', title: '内存管理', markdown: `## 内存管理

1. 分配、映射、保护和回收内存。
2. 让每个进程拥有相对独立的地址空间。
3. 关键词：虚拟内存、页表。` },
            { id: 'storage-management', title: '文件与存储管理', markdown: `## 文件与存储管理

1. 把磁盘空间组织成文件和目录。
2. 维护名称、位置、权限和读写状态。
3. 关键词：文件系统、缓存。` },
            { id: 'device-management', title: '设备与输入输出', markdown: `## 设备与输入输出

1. 借助驱动程序统一控制屏幕、键盘、磁盘、摄像头和网卡等不同设备。
2. 关键词：驱动、中断、I/O。` },
            { id: 'communication', title: '通信与网络', markdown: `## 通信与网络

1. 帮助同一台电脑上的进程交换数据。
2. 负责组织与外部计算机的网络通信。
3. 关键词：管道、套接字、IPC。` },
            { id: 'security', title: '权限与安全', markdown: `## 权限与安全

1. 管理用户身份和资源访问权限。
2. 利用隔离机制限制程序能够执行的操作。
3. 关键词：用户、权限、隔离。` }
          ]
        },
        {
          id: 'runtime-concepts',
          title: '程序运行时的常用概念',
          cards: [
            { id: 'program-application', title: '程序与应用程序', markdown: `## 程序与应用程序

1. **程序**：保存在磁盘上的代码和数据，本身是静态的；还没有运行时，它不是进程。
2. **应用程序**：面向用户完成某类任务的软件产品。一个应用运行时可能包含一个或多个进程。` },
            { id: 'process-thread', title: '进程与线程', markdown: `## 进程与线程

1. **进程**：程序的一次运行实例，也是操作系统分配和隔离内存、文件等资源的容器。
2. **线程**：进程中真正执行代码的工作流。同一进程中的线程共享大部分资源，但拥有各自的调用栈。` },
            { id: 'parent-pid', title: '父子进程与进程编号', markdown: `## 父子进程与进程编号

1. 一个进程创建另一个进程时，前者是父进程，后者是子进程；它们仍是两个独立进程。
2. PID 是进程的唯一编号，PPID 是其父进程的编号。` },
            { id: 'system-call-mode', title: '系统调用、用户态与内核态', markdown: `## 系统调用、用户态与内核态

1. **系统调用**：应用向操作系统内核请求服务的受控入口，例如创建进程、读文件或申请内存。
2. **用户态**：普通应用运行的受限状态。
3. **内核态**：操作系统执行受保护服务时使用的高权限状态。` },
            { id: 'ipc-concurrency', title: '进程间通信、并发与并行', markdown: `## 进程间通信、并发与并行

1. **进程间通信**：不同进程通过管道、套接字、共享内存或 Mach Port 等机制交换数据。
2. **并发**：多个任务交替推进。
3. **并行**：多个任务在多个 CPU 核心上同一时刻真正执行。` }
          ]
        }
      ]
    },
    {
      id: 'architecture',
      number: '02',
      title: '组成架构',
      summary: '从应用一路向下，看操作系统如何连接软件、内核与硬件。',
      takeaway: '操作系统向上提供抽象和接口，向下管理 CPU、内存、存储与设备。',
      body: `
        <div class="os-stack" aria-label="操作系统组成架构">
          <div class="os-layer os-layer-app"><span>应用层</span><strong>浏览器 · 编辑器 · 微信 · 终端</strong><small>提出"打开文件、创建进程、发送数据"等请求</small></div>
          <div class="os-layer os-layer-api"><span>接口层</span><strong>系统调用</strong><small>用户程序进入内核服务的安全入口</small></div>
          <div class="os-layer os-layer-kernel"><span>内核层</span><strong>进程调度 · 内存管理 · 文件系统 · 网络 · 驱动</strong><small>决定谁能使用什么资源，以及何时使用</small></div>
          <div class="os-layer os-layer-hardware"><span>硬件层</span><strong>CPU · 内存 · 磁盘 · 网卡 · 屏幕</strong><small>真正完成计算、存储、通信与输入输出</small></div>
        </div>

        <div class="os-card-grid">
          <article class="os-card"><p class="os-card-kicker">CPU</p><h3>进程与线程管理</h3><p>应用请求创建线程，操作系统负责调度：决定哪个线程何时运行、在哪个 CPU 核心上运行，以及何时暂停。</p></article>
          <article class="os-card"><p class="os-card-kicker">Memory</p><h3>内存管理</h3><p>为每个进程提供看似独立的地址空间，进行分配、映射、保护和回收，避免应用随意读写彼此的数据。</p></article>
          <article class="os-card"><p class="os-card-kicker">Storage</p><h3>文件系统</h3><p>把磁盘块组织成文件和目录，并管理名称、权限、缓存、读写位置与崩溃后的数据一致性。</p></article>
          <article class="os-card"><p class="os-card-kicker">I/O</p><h3>设备与通信</h3><p>通过驱动使用硬件，通过管道、套接字和 Mach Port 等机制帮助进程安全通信。</p></article>
        </div>

        <div class="os-note"><strong>一个容易混淆的点</strong><p>活动监视器里的"端口"主要指 macOS 用于进程间通信的 <strong>Mach Port</strong>，不是网站常说的 80、443、8000 等 TCP/UDP 网络端口。</p></div>
      `
    },
    {
      id: 'history',
      number: '03',
      title: '发展历程',
      summary: '操作系统的发展，本质上是在效率、易用性、隔离性与规模之间不断取舍。',
      takeaway: '新机制往往不是凭空出现，而是为了解决上一代系统暴露出的具体问题。',
      body: `
        <div class="os-timeline">
          <article><time>1940s–1950s</time><div><h3>手工操作与批处理</h3><p>早期计算机一次只运行一个任务，操作员手工装载程序。批处理系统随后把任务排成队列，减少机器等待人的时间。</p></div></article>
          <article><time>1960s</time><div><h3>多道程序与分时系统</h3><p>多个程序同时留在内存中；当一个任务等待输入输出时，CPU 转去运行另一个。分时进一步让多个用户感觉自己独占计算机。</p></div></article>
          <article><time>1969–1970s</time><div><h3>Unix 与可移植系统</h3><p>Unix 形成了进程、文件、管道等影响深远的抽象，并主要用 C 重写，使操作系统更容易移植到不同硬件。</p></div></article>
          <article><time>1980s</time><div><h3>个人计算机与图形界面</h3><p>计算机从机房走向个人桌面，操作系统开始重点解决交互、图形界面、外设支持与普通用户的易用性。</p></div></article>
          <article><time>1990s</time><div><h3>现代内核与网络普及</h3><p>Linux、Windows NT 等系统发展壮大，内存保护、多任务、权限和网络成为桌面及服务器的基础能力。</p></div></article>
          <article><time>2000s–现在</time><div><h3>多核、移动、云与安全</h3><p>操作系统需要利用多核 CPU，并支撑手机、虚拟机、容器和大规模云服务；隔离、能耗与安全的重要性持续上升。</p></div></article>
        </div>
        <div class="os-note"><strong>读历史的方法</strong><p>不要只记年份。每看到一个机制，都问三件事：当时遇到了什么问题？旧方案为什么不够？新方案又付出了什么代价？</p></div>
      `
    },
    {
      id: 'cases',
      number: '04',
      title: '应用案例',
      summary: '把抽象概念放回每天使用的 Mac，观察操作系统在真实任务中的作用。',
      takeaway: '看懂一个日常操作背后的进程、线程、系统调用与资源变化，就是最好的入门实践。',
      body: `
        <div class="os-case-list">
          <article class="os-case">
            <div class="os-case-no">A</div>
            <div><h3>打开 WorkBuddy</h3><p>主进程负责应用生命周期，Renderer 进程绘制页面，GPU 进程处理图形任务；每个进程内部又有多个线程。操作系统为它们分配 PID、隔离内存并调度线程。</p><span>对应概念：应用、多进程、线程、进程间通信</span></div>
          </article>
          <article class="os-case">
            <div class="os-case-no">B</div>
            <div><h3>在终端运行命令</h3><p>Shell 创建子进程来执行命令，通常等待它结束，再读取退出状态并显示新的提示符。用管道连接两个命令时，操作系统还要在进程之间传递数据。</p><span>对应概念：父子进程、系统调用、管道、文件描述符</span></div>
          </article>
          <article class="os-case">
            <div class="os-case-no">C</div>
            <div><h3>播放音乐同时操作界面</h3><p>播放器可以让不同线程分别处理界面、音频解码和声音输出。即使后台正在解码，界面线程仍能响应暂停按钮。</p><span>对应概念：并发、线程调度、共享内存、设备驱动</span></div>
          </article>
          <article class="os-case">
            <div class="os-case-no">D</div>
            <div><h3>打开并保存一个文件</h3><p>应用通过系统调用请求打开文件，操作系统检查权限、查找目录和文件信息、缓存磁盘数据，最后由设备驱动完成实际读写。</p><span>对应概念：文件系统、权限、缓存、输入输出</span></div>
          </article>
        </div>

        <div class="os-observe">
          <div><span class="os-observe-label">下一步练习</span><strong>追踪一次真实操作</strong></div>
          <p>从上面任选一个案例，用"谁发起请求 → 哪个进程处理 → 哪些线程工作 → 操作系统管理什么资源"的顺序，画一张自己的流程图。</p>
        </div>
      `
    }
  ]
};
