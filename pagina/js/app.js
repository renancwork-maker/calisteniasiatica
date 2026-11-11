/* Atlas • Calistenia Asiática em Casa — navegação leve sem bibliotecas pesadas.
   O pacote original não continha o módulo de etapas; perguntas reconstruídas para um fluxo funcional.
   Checkout único: WIAPY. Vídeo único: VTurb informado pelo proprietário. */
(function () {
  'use strict';
  const root = document.getElementById('root');
  if (!root) return;
  const CHECKOUT_URL = 'https://pay.wiapy.com/e6WX0PxZmlLo';
  const VTURB_SCRIPT = 'https://scripts.converteai.net/e040da1c-3494-4229-81c5-b7e4caf21ba7/players/6af495416685e101a472e87e/v4/player.js';
  const VTURB_LIB = 'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js';
  const VTURB_STREAM = 'https://cdn.converteai.net/e040da1c-3494-4229-81c5-b7e4caf21ba7/6af4951bdd977102737c257c/main.m3u8';
  const STORAGE_KEY = 'atlas_calisthenia_21d_answers';
  const UTM_KEY = 'atlas_calisthenia_21d_traffic';
  const SELECTED_KEYS = new Set(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','src','sck','xcod','subid','subid1','subid2','subid3','subid4','subid5','fbclid','gclid','gbraid','wbraid','msclkid','ttclid','gad_source']);
  const escapeHTML = (input) => String(input ?? '').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const getStep = () => {
    const result = location.pathname.match(/^\/pagina\/step-(\d+)\/?$/i);
    return result ? Math.max(1,Math.min(35,Number(result[1]))) : 1;
  };
  let current = getStep();
  let answers = {};
  try { answers = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch (_err) { answers = {}; }
  const remember = () => { try { sessionStorage.setItem(STORAGE_KEY,JSON.stringify(answers)); } catch (_) {} };
  const rememberTraffic = () => {
    try {
      const known = new URLSearchParams(sessionStorage.getItem(UTM_KEY) || '');
      const url = new URLSearchParams(location.search);
      for (const [key,value] of url) if (SELECTED_KEYS.has(key.toLowerCase()) && value) known.set(key,value);
      sessionStorage.setItem(UTM_KEY, known.toString());
    } catch (_) {}
  };
  rememberTraffic();
  function checkoutHref () {
    const result = new URL(CHECKOUT_URL);
    try {
      const source = new URLSearchParams(sessionStorage.getItem(UTM_KEY) || '');
      source.forEach((value,key)=> { if (SELECTED_KEYS.has(key.toLowerCase()) && value) result.searchParams.set(key,value); });
    } catch (_) {}
    return result.toString();
  }
  const opt = (key,title,desc,values,multi=false) => ({type:multi?'multi':'single',key,title,desc,values});
  const page = (title,desc) => ({type:'info',title,desc});
  const questions = {
    2:page('É possível começar com movimentos simples','A proposta é avançar gradualmente e respeitar seu próprio ritmo, mesmo que você ainda não tenha experiência com calistenia.'),
    3:opt('calistheniaExperience','Você já praticou calistenia antes?','Sua resposta ajuda a indicar o melhor ponto de partida.',[['sim','Sim, já pratiquei'],['nao','Não, estou começando agora']]),
    4:page('Cada jornada começa de um jeito','O programa foi pensado para ter exercícios progressivos. Você pode adaptar a intensidade à sua experiência.'),
    5:opt('mainGoal','Qual é seu principal objetivo?','Escolha o que mais importa para você neste momento.',[['condicionamento','Melhorar o condicionamento físico'],['forca','Ganhar força e resistência'],['tonificar','Fortalecer e tonificar o corpo'],['mobilidade','Melhorar mobilidade e disposição']]),
    6:opt('additionalGoals','Quais outros objetivos você tem?','Você pode selecionar mais de uma opção.',[['postura','Trabalhar a postura'],['equilibrio','Melhorar o equilíbrio'],['rotina','Criar uma rotina de exercícios'],['bemestar','Ter mais disposição no dia a dia']],true),
    7:opt('bodyZones','Quais regiões você quer trabalhar?','Selecione uma ou mais regiões para orientar seu foco.',[['abdomen','Abdômen'],['pernas','Pernas e glúteos'],['bracos','Braços e ombros'],['costas','Costas e postura'],['total','Corpo inteiro']],true),
    8:opt('targetZones','Qual região você deseja priorizar?','Escolha uma ou mais áreas.',[['core','Abdômen e região central'],['membros','Pernas e glúteos'],['superior','Parte superior do corpo'],['geral','Fortalecimento geral']],true),
    9:page('Movimento inteligente, em casa','Você não precisa começar com exercícios avançados. O importante é ter constância e evoluir com segurança.'),
    10:opt('bodyType','Como você descreve seu corpo atualmente?','Não existe resposta certa ou errada.',[['magro','Mais magro'],['medio','Intermediário'],['encorpado','Mais encorpado'],['pular','Prefiro não responder']]),
    11:opt('dreamBody','Que evolução você gostaria de perceber?','Seu objetivo ajuda a organizar a sua jornada.',[['forca','Mais firmeza e força'],['energia','Mais energia'],['mobilidade','Mais flexibilidade e mobilidade'],['habito','Uma rotina constante']]),
    12:opt('fitnessHistory','Como está sua rotina de exercícios?','Queremos entender seu ponto de partida.',[['nunca','Não tenho uma rotina'],['raramente','Me exercito raramente'],['asvezes','Algumas vezes por semana'],['frequente','Já treino com frequência']]),
    13:opt('limitations','Você precisa adaptar algum movimento?','Selecione tudo o que for relevante. Se tiver dúvidas sobre sua saúde, converse com um profissional de saúde antes de começar.',[['joelho','Tenho desconforto nos joelhos'],['lombar','Tenho desconforto nas costas'],['ombro','Tenho desconforto nos ombros'],['sem','Não tenho limitações conhecidas']],true),
    14:opt('comfortLevel','Como você se sente treinando em casa?','É importante que os movimentos sejam confortáveis para você.',[['iniciante','Quero começar bem devagar'],['moderado','Tenho certa familiaridade'],['avancado','Já me sinto confiante']]),
    15:page('Tudo bem avançar no seu ritmo','Com exercícios de intensidade progressiva, você pode descobrir o que funciona melhor para sua rotina. Pausas e adaptações fazem parte do processo.'),
    16:{type:'number',key:'height',title:'Qual é a sua altura?',desc:'Essa informação é opcional para personalizar seu resumo.',initial:165,min:120,max:220,unit:'cm'},
    17:{type:'number',key:'currentWeight',title:'Qual é o seu peso atual?',desc:'Use um valor aproximado, se preferir.',initial:73,min:30,max:250,unit:'kg'},
    18:{type:'number',key:'targetWeight',title:'Você tem um peso de referência?',desc:'Se seu foco não for o peso, pode manter o valor atual. O programa não promete uma mudança específica na balança.',initial:73,min:30,max:250,unit:'kg'},
    19:{type:'number',key:'exactAge',title:'Qual é a sua idade?',desc:'Queremos ajustar a proposta ao seu momento de vida.',initial:50,min:18,max:100,unit:'anos'},
    20:opt('lifestyle','Como é seu dia a dia?','Escolha a resposta que combina mais com sua rotina.',[['sentada','Passo boa parte do tempo sentada'],['movimento','Caminho ou me movimento durante o dia'],['ativa','Tenho uma rotina bastante ativa']]),
    21:opt('energyLevel','Como costuma estar sua disposição?','Considere seu dia a dia, não apenas agora.',[['baixa','Frequentemente me sinto sem energia'],['media','Varia bastante'],['alta','Geralmente tenho boa disposição']]),
    22:opt('waterIntake','Como está seu consumo de água?','Pequenos hábitos também podem ajudar seu bem-estar.',[['pouca','Bebo pouca água'],['moderada','Bebo uma quantidade moderada'],['boa','Costumo me hidratar bem']]),
    23:opt('sleepDuration','Quantas horas você costuma dormir?','Escolha uma média aproximada.',[['menos6','Menos de 6 horas'],['6a7','Entre 6 e 7 horas'],['7a9','Entre 7 e 9 horas'],['mais9','Mais de 9 horas']]),
    24:opt('mealPreferences','Quais hábitos alimentares combinam com você?','Pode marcar mais de um.',[['caseira','Gosto de comida feita em casa'],['pratica','Prefiro receitas práticas'],['variada','Gosto de experimentar opções variadas'],['sem','Não tenho preferência']],true),
    25:opt('habits','O que você gostaria de fazer com mais frequência?','Selecione o que deseja colocar na rotina.',[['treinar','Reservar um tempo para exercícios'],['caminhar','Caminhar mais'],['agua','Beber mais água'],['descansar','Dormir melhor']],true),
    26:opt('lifeEvents','O que mais dificulta sua rotina hoje?','Você pode selecionar mais de uma opção.',[['tempo','Falta de tempo'],['cansaco','Cansaço'],['desanimo','Dificuldade de manter a motivação'],['nada','Nada em especial']],true),
    27:page('Seu motivo é o seu ponto de partida','Construir um hábito de exercícios pode ser mais simples quando você dedica alguns minutos por dia e acompanha sua própria evolução.'),
    28:page('Imagine uma rotina de movimento que cabe no seu dia','Comece pelo básico, observe o que seu corpo permite e avance pouco a pouco ao longo dos 21 dias.'),
    29:page('Estamos organizando suas respostas','Seu resumo está quase pronto. Vamos reunir os principais pontos que você selecionou.'),
    30:page('Sua evolução é individual','O progresso pode acontecer de várias formas: mais regularidade, força, mobilidade e disposição. Resultados variam conforme a pessoa.'),
    31:page('Seu perfil está pronto!','Com suas respostas, você já tem um ponto de partida para organizar uma rotina de calistenia em casa.'),
    32:opt('motivationReal','O que mais te motiva a começar?','Escolha o motivo que mais combina com você.',[['saude','Priorizar meu bem-estar'],['energia','Ter mais disposição'],['forca','Sentir meu corpo mais forte'],['rotina','Ter um momento para mim']]),
    33:opt('commitmentLevel','Quando você gostaria de começar?','O primeiro passo é escolher um momento que caiba na sua rotina.',[['hoje','Hoje'],['amanha','Amanhã'],['semana','Nesta semana']]),
    34:page('Sua jornada de 21 dias está definida','Você já escolheu seus objetivos e o melhor momento para iniciar. Na próxima tela, conheça o programa completo e veja como ter acesso.')
  };
  function header(back=true) {
    return `<div class="page-top"><header class="site-header">${back?'<button class="back" type="button" data-back aria-label="Voltar">‹ Voltar</button>':''}<span class="brand">CALISTENIA</span><span class="by">by Atlas</span></header><div class="progress" aria-label="Progresso do questionário"><i style="width:${Math.round(current/35*100)}%"></i></div></div>`;
  }
  function wrap(markup,cssClass='') { root.innerHTML=`<div class="page ${cssClass} slide-in">${header(current>1)}${markup}</div>`; }
  function intro() {
    root.innerHTML=`<div class="page slide-in"><header class="hdr"><span class="hdr-logo">CALISTENIA</span><span class="hdr-badge">by Atlas</span></header><main class="main"><div class="title"><h1>Programa de Calistenia Asiática <span class="hl">para Mulheres</span></h1><p class="sub">De acordo com sua idade</p><p class="badge">TESTE DE 1 MINUTO</p></div><div class="btns">${['39 - 45','46 - 50','51 - 60','60+'].map(a=>`<button type="button" class="btn" data-age="${a}"><span>${a}</span><span class="arrow">›</span></button>`).join('')}</div><img class="hero-img" src="/pagina/images/asian-woman-fitness.webp" srcset="/pagina/images/asian-woman-fitness-520.webp 520w,/pagina/images/asian-woman-fitness.webp 760w" sizes="(max-width:768px) 420px,450px" alt="Mulher asiática praticando calistenia" width="760" height="694" fetchpriority="high" decoding="async"><footer class="ftr">Ao escolher sua idade e continuar, concorda com nossos <a href="#">Termos de Serviço</a> e reconhece nossa <a href="#">Política de Privacidade</a> e <a href="#">Política de Cookies</a></footer></main></div>`;
  }
  function screenText(title,desc,content) {
    wrap(`<main class="stage"><p class="step-chip">Sua jornada • Etapa ${current} de 35</p><h1>${escapeHTML(title)}</h1><p class="desc">${escapeHTML(desc)}</p>${content}</main>`);
  }
  function renderQuestion(step) {
    if (step.type==='info') {
      let detail='';
      if(current===31) detail=`<div class="panel"><h2>Seu ponto de partida</h2><ul class="list-check"><li>Idade informada: ${escapeHTML(answers.exactAge||'não informada')}</li><li>Foco: ${escapeHTML((questions[5].values.find(x=>x[0]===answers.mainGoal)||[])[1]||'movimento e bem-estar')}</li><li>Programa progressivo de 21 dias em casa</li></ul></div>`;
      if(current===34) detail='<div class="panel"><ul class="list-check"><li>Treinos em casa com movimentos progressivos</li><li>Foco em constância e adaptação ao seu nível</li><li>Um plano para acompanhar ao longo de 21 dias</li></ul></div>';
      screenText(step.title,step.desc,`${detail}<button type="button" class="primary" data-next>${current===34?'CONHECER MINHA OFERTA':'CONTINUAR'} <span>›</span></button>`);
      return;
    }
    if(step.type==='number') {
      const val=answers[step.key]===undefined?step.initial:answers[step.key];
      screenText(step.title,step.desc,`<label class="unit" for="value-input">Informe em ${escapeHTML(step.unit)}</label><input id="value-input" class="numeric" type="number" inputmode="decimal" min="${step.min}" max="${step.max}" value="${escapeHTML(val)}" data-number="${step.key}" aria-label="${escapeHTML(step.title)}"><div class="unit">${escapeHTML(step.unit)}</div><p class="note" id="validation-message" role="status"></p><button type="button" class="primary" data-save-number="${step.key}">CONTINUAR ›</button>`);
      return;
    }
    const values=step.values.map(([value,label])=>{
      const selected=step.type==='multi'?Array.isArray(answers[step.key])&&answers[step.key].includes(value):answers[step.key]===value;
      return `<button type="button" class="choice ${selected?'selected':''}" data-${step.type==='multi'?'multi':'single'}="${escapeHTML(step.key)}" data-value="${escapeHTML(value)}" aria-pressed="${selected?'true':'false'}"><span>${escapeHTML(label)}</span><span>${selected?'✓':'›'}</span></button>`;
    }).join('');
    screenText(step.title,step.desc,`<div class="choice-list">${values}</div>${step.type==='multi'?'<button type="button" class="primary" data-next>CONTINUAR ›</button>':''}${current===13?'<p class="note">Respeite seus limites e interrompa um exercício que cause dor.</p>':''}`);
  }
  let vturbRequested=false;
  function addHint(rel,href,as) {
    if (document.head.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;
    const el=document.createElement('link');el.rel=rel;el.href=href;if(as)el.as=as;
    if (rel==='preload' && as==='fetch') el.crossOrigin='anonymous';
    document.head.appendChild(el);
  }
  function prepareVTurb() {
    /* Vturb optimization only on the offer to protect early FCP/LCP of quiz steps. */
    if(!window._plt) window._plt=performance && performance.timeOrigin? performance.timeOrigin+performance.now():Date.now();
    ['cdn.converteai.net','scripts.converteai.net','images.converteai.net','license.vturb.com'].forEach(host=>addHint('dns-prefetch','https://'+host));
    addHint('preload',VTURB_SCRIPT,'script');
    addHint('preload',VTURB_LIB,'script');
    addHint('preload',VTURB_STREAM,'fetch');
  }
  function attachVTurb() {
    if(vturbRequested) return;
    vturbRequested=true;
    /* Corresponds to: <script type="text/javascript"> var s=document.createElement("script"); s.src=".../v4/player.js"; s.async=!0; document.head.appendChild(s); </script> */
    var s=document.createElement('script');s.src=VTURB_SCRIPT;s.async=true;document.head.appendChild(s);
  }
  function offer() {
    prepareVTurb();
    const href=escapeHTML(checkoutHref());
    wrap(`<main class="stage"><p class="step-chip">Seu plano • 21 dias</p><h1>Seu Programa de <span class="hl">Calistenia Asiática em Casa</span> está pronto</h1><p class="desc">Conheça o programa e veja como começar com exercícios progressivos sem sair de casa.</p><div class="video-wrap"><vturb-smartplayer id="vid-6af495416685e101a472e87e" style="display:block;margin:0 auto;width:100%;max-width:400px"><div class="vturb-player-placeholder" style="position:relative;width:100%;padding:178.21782178217822% 0 0;z-index:0;background-color:black"></div></vturb-smartplayer></div><div class="offer-price"><small>Pagamento único</small><div>R$ 37,90</div></div><p class="offer-price-caption">Acesso ao programa de 21 dias</p><a class="checkout" href="${href}" data-checkout rel="noopener noreferrer">QUERO COMEÇAR AGORA ›</a><p class="trust">🔒 Checkout seguro na Wiapy • Compra pela plataforma de pagamento</p><section class="panel"><h2>O que está incluído</h2><ul class="list-check"><li>Programa de calistenia para treinar em casa</li><li>Sequência progressiva para 21 dias</li><li>Orientações para iniciar no seu ritmo</li><li>Exercícios com foco em força e mobilidade</li></ul></section><a class="checkout" href="${href}" data-checkout rel="noopener noreferrer">GARANTIR MEU ACESSO — R$ 37,90 ›</a><p class="tiny">Resultados individuais variam. Respeite seus limites físicos e consulte um profissional de saúde se necessário.</p></main>`,'offer');
    attachVTurb();
  }
  function render() {
    document.title=current===35?'Calistenia Asiática em Casa — Acesso | Atlas':'Calistenia Asiática em Casa — 21 Dias | Atlas';
    if(current===1){if(!root.querySelector('[data-boot-intro]'))intro();} else if(current===35)offer(); else renderQuestion(questions[current]);
    window.scrollTo({top:0,behavior:'instant'});
  }
  function goTo(next,replace=false) {
    current=Math.min(35,Math.max(1,next));
    const url=current===1?'/pagina/':'/pagina/step-'+current;
    const params=location.search;
    if(replace)history.replaceState({step:current},'',url+params); else history.pushState({step:current},'',url+params);
    render();
  }
  root.addEventListener('click',event=>{
    const button=event.target.closest('button');
    if(!button)return;
    if(button.hasAttribute('data-back'))return goTo(current-1);
    if(button.hasAttribute('data-age')){answers.ageRange=button.getAttribute('data-age');remember();return goTo(2);}
    if(button.hasAttribute('data-next'))return goTo(current+1);
    if(button.hasAttribute('data-single')){
      answers[button.getAttribute('data-single')]=button.getAttribute('data-value');remember();return goTo(current+1);
    }
    if(button.hasAttribute('data-multi')){
      const key=button.getAttribute('data-multi'),value=button.getAttribute('data-value');
      let values=Array.isArray(answers[key])?answers[key].slice():[];
      if(values.includes(value))values=values.filter(item=>item!==value);
      else { if(value==='sem'||value==='nada') values=[];else values=values.filter(item=>item!=='sem'&&item!=='nada'); values.push(value); }
      answers[key]=values;remember();renderQuestion(questions[current]);return;
    }
    if(button.hasAttribute('data-save-number')){
      const el=root.querySelector('[data-number]');
      const key=button.getAttribute('data-save-number'),settings=questions[current];
      const value=Number(el.value);
      const feedback=root.querySelector('#validation-message');
      if(!Number.isFinite(value)||value<settings.min||value>settings.max){feedback.textContent=`Digite um número entre ${settings.min} e ${settings.max}.`;el.focus();return;}
      answers[key]=value;remember();goTo(current+1);
    }
  });
  root.addEventListener('keydown',event=>{
    if(event.key==='Enter'&&event.target.matches('[data-number]')){
      event.preventDefault();root.querySelector('[data-save-number]')?.click();
    }
  });
  addEventListener('popstate',()=>{current=getStep();rememberTraffic();render();});
  render();
})();
