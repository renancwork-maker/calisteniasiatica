/* Atlas • Calistenia Asiática em Casa — navegação leve sem bibliotecas pesadas.
   O pacote original não continha o módulo de etapas; perguntas reconstruídas para um fluxo funcional.
   Checkout único: MIVVO. Vídeo único: VTurb informado pelo proprietário. */
(function () {
  'use strict';
  const root = document.getElementById('root');
  if (!root) return;
  const CHECKOUT_URL = 'https://app.mivvo.com.br/checkout/01a1e6d7-3f74-78a3-ad79-1e15491863ed';
  const VTURB_SCRIPT = 'https://scripts.converteai.net/e040da1c-3494-4229-81c5-b7e4caf21ba7/players/6afba5f7d4334aee81183338/v4/player.js';
  const VTURB_LIB = 'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js';
  const VTURB_STREAM = 'https://cdn.converteai.net/e040da1c-3494-4229-81c5-b7e4caf21ba7/6afba5ebdac166e521958649/main.m3u8';
  const STORAGE_KEY = 'atlas_calisthenia_21d_answers';
  const OFFER_START_KEY = 'atlas_calisthenia_21d_offer_started';
  const OFFER_UNLOCK_MS = 323000; // 5m23s após abrir a oferta
  let offerUnlockTimer = null;
  const UTM_KEY = 'atlas_calisthenia_21d_traffic';
  const SELECTED_KEYS = new Set(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','src','sck','xcod','subid','subid1','subid2','subid3','subid4','subid5','fbclid','gclid','gbraid','wbraid','msclkid','ttclid','gad_source']);
  const escapeHTML = (input) => String(input ?? '').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const getStep = () => {
    const result = location.pathname.match(/^\/pagina\/step-(\d+)\/?$/i);
    return result ? Math.max(1,Math.min(35,Number(result[1]))) : 1;
  };
  let current = getStep();
  let showQuizLead = false;
  let answers = {};
  if (current === 1) { try { sessionStorage.removeItem(STORAGE_KEY); } catch (_err) {} }
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
    13:opt('limitations','Você sente desconforto em algum movimento?','Selecione tudo o que for relevante. Se tiver dúvidas sobre sua saúde, converse com um profissional de saúde antes de começar.',[['joelho','Tenho desconforto nos joelhos'],['lombar','Tenho desconforto nas costas'],['ombro','Tenho desconforto nos ombros'],['sem','Não tenho limitações conhecidas']],true),
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
    24:opt('mealPreferences','Quais são suas preferências de refeição?','Pode marcar mais de um.',[['vegetariana','Eu sou vegetariana'],['vegana','Eu sou vegana'],['gluten','Não contém glúten'],['lactose','Sem lactose'],['semrestricoes','Sem restrições']],true),
    25:opt('habits','Quais desses hábitos você tem?','Selecione todos os que se aplicam.',[['procrastinacao','Procrastinação'],['alimentacao','Alimentação pouco saudável'],['midias','Mídias sociais'],['cafeina','Beber muita cafeína'],['series','Maratona de séries']],true),
    26:opt('lifeEvents','O que mais dificulta sua rotina hoje?','Você pode selecionar mais de uma opção.',[['tempo','Falta de tempo'],['cansaco','Cansaço'],['desanimo','Dificuldade de manter a motivação'],['nada','Nada em especial']],true),
    27:page('Seu motivo é o seu ponto de partida','Construir um hábito de exercícios pode ser mais simples quando você dedica alguns minutos por dia e acompanha sua própria evolução.'),
    28:page('Imagine uma rotina de movimento que cabe no seu dia','Comece pelo básico, observe o que seu corpo permite e avance pouco a pouco ao longo dos 21 dias.'),
    29:page('Estamos organizando suas respostas','Seu resumo está quase pronto. Vamos reunir os principais pontos que você selecionou.'),
    30:page('Sua evolução é individual','O progresso pode acontecer de várias formas: mais regularidade, força, mobilidade e disposição. Resultados variam conforme a pessoa.'),
    31:page('Suas respostas estão organizadas!','Suas escolhas ajudam você a reconhecer objetivos e hábitos antes de conhecer o programa completo de exercícios em casa.'),
    32:opt('motivationReal','O que mais te motiva a começar?','Escolha o motivo que mais combina com você.',[['saude','Priorizar meu bem-estar'],['energia','Ter mais disposição'],['forca','Sentir meu corpo mais forte'],['rotina','Ter um momento para mim']]),
    33:opt('commitmentLevel','Quando você gostaria de começar?','O primeiro passo é escolher um momento que caiba na sua rotina.',[['hoje','Hoje'],['amanha','Amanhã'],['semana','Nesta semana']]),
    34:page('Seu próximo passo é conhecer o programa','Agora você pode conhecer o que está incluído no programa de 21 dias e decidir se deseja ter acesso ao conteúdo completo.')
  };
  // Recriação mobile-first das telas fornecidas pelo proprietário em sequência.
  const A='/pagina/images/';
  const picture=(file,cls='',attrs='')=>`<img class="${cls}" src="${A}${file}" loading="lazy" decoding="async" alt="" ${attrs}>`;
  const reference={
    3:{key:'calistheniaExperience',type:'single',title:'Você já experimentou a calistenia asiática?',items:['Sim','Não']},
    5:{key:'mainGoal',type:'single',title:'Qual é seu <em>principal objetivo</em>?',items:['Perder peso','Desenvolver músculos','Manter o peso e ficar em forma','Melhorar a aptidão física'],symbols:['⚖','♧','♙','ϟ']},
    6:{key:'additionalGoals',type:'multi',title:'O que mais você espera alcançar com este plano?',subtitle:'Pode escolher várias opções',items:['Aumentar a energia','Melhorar o sono','Reduzir o estresse','Melhorar a postura e a mobilidade','Desenvolver flexibilidade'],symbols:['▣','☾','♧','✣','✧']},
    7:{key:'bodyZones',type:'multi',title:'Quais regiões do corpo você mais quer trabalhar?',subtitle:'Por favor, selecione todas as opções aplicáveis',items:['Melhorar o corpo inteiro','Abdômen','Peitoral','Ombros','Costas','Braços','Pernas','Joelhos']},
    8:{key:'targetZones',type:'multi',title:'Quais regiões você quer priorizar?',subtitle:'Escolha todas as opções aplicáveis',items:['Abdômen','Peitoral','Pernas','Ombros','Braços','Costas']},
    10:{key:'bodyType',type:'single',title:'Como você descreveria o seu corpo atualmente?',items:['Magro','Peso intermediário','Acima do peso','Sobrepeso']},
    11:{key:'dreamBody',type:'single',title:'Qual resultado físico você busca?',items:['Mais definido','Mais forte','Em forma','Tonificado','Estou bem com meu corpo']},
    12:{key:'fitnessHistory',type:'single',title:'Há quanto tempo você estava na melhor forma da sua vida?',items:['1 a 2 anos atrás','3 a 5 anos atrás','Mais de 5 anos atrás','Nunca']},
    13:{key:'limitations',type:'multi',title:'Você tem dificuldades com algum dos seguintes itens?',subtitle:'Por favor, selecione todas as opções aplicáveis',items:['Costas sensíveis','Joelhos sensíveis','Quadril sensível','Ombros e braços','Panturrilhas e tornozelos','Nenhuma das opções acima']},
    14:{key:'comfortLevel',type:'single',title:'Como você se sente ao se exercitar?',items:['Sinto dor/Desconforto','Sinto alguma dificuldade','Sinto-me confortável'],symbols:['😣','😳','😊']}
  };
  function hdr(back=true){return `<div class="page-top"><header class="site-header">${back?'<button type="button" class="back" data-back aria-label="Voltar">‹</button>':''}<span class="brand">CALISTENIA</span><span class="by">by Atlas</span></header>${back?`<div class="progress"><i style="width:${Math.round(current/35*100)}%"></i></div>`:''}</div>`;}
  function shell(markup,cls=''){root.innerHTML=`<div class="page ${cls}">${hdr(current>1)}${markup}</div>`;}
  function mainStage(inner,cls='',bottom=''){shell(`<main class="reference-stage ${cls}">${inner}${bottom?`<div class="bottom-action">${bottom}</div>`:''}</main>`,'reference-page');}
  const continueButton=(text='Continuar')=>`<button class="primary" type="button" data-next>${text}</button>`;
  function illustrationStep(img,title,desc='',extraClass='',button='Continuar'){
    mainStage(`<div class="info-block ${extraClass}">${picture(img,'info-picture','width="410" height="350"')}<div class="info-copy"><h1>${title}</h1><p>${desc}</p></div></div>`,'info-stage',continueButton(button));
  }
  function optionsFor(ref){
    const key=ref.key, multi=ref.type==='multi', selected=answers[key];
    return ref.items.map((label,i)=>{
      const on=multi?Array.isArray(selected)&&selected.includes(String(i)):selected===String(i);
      const icon=ref.symbols?`<span class="choice-icon">${ref.symbols[i]}</span>`:'';
      const step7Thumbs=[null,'region-belly.webp','region-chest.webp','region-shoulder.webp','region-back.webp','male-dip.webp','region-legs.webp','region-knee.webp'];
      const step8Thumbs=['region-belly.webp','region-chest.webp','region-legs.webp','region-shoulder.webp','male-dip.webp','region-back.webp'];
      const step11Thumbs=['body-dream.webp','goal-muscle.webp','goal-fitness.webp','body-toned.webp','body-average.webp'];
      const step13Thumbs=['region-back.webp','region-knee.webp','region-legs.webp','region-shoulder.webp','region-knee.webp'];
      const step5Thumbs=['goal-loss.webp','goal-muscle.webp','body-dream.webp','goal-fitness.webp'];
      const thumb=current===7&&i>0?picture(step7Thumbs[i],'choice-thumb'):
       current===8?picture(step8Thumbs[i],'choice-thumb'):
       current===11?picture(step11Thumbs[i],'choice-thumb'):
       current===5?picture(step5Thumbs[i],'choice-thumb'):
       current===13&&i<5?picture(step13Thumbs[i],'choice-thumb'):'';
      const mark=multi?`<span class="option-check" aria-hidden="true">${on?'✓':''}</span>`:(current===3?'':`<span class="option-arrow" aria-hidden="true">${current===14?'':'›'}</span>`);
      if(current===7&&i===0)return '';
      return `<button type="button" class="choice ref-choice ${on?'selected':''} ${current===7&&i===0?'plain-choice':''}" data-${multi?'multi':'single'}="${key}" data-value="${i}" aria-pressed="${on?'true':'false'}">${thumb||icon}<span class="choice-label">${label}</span>${mark}</button>`;
    }).join('');
  }
  function renderReference(){
    if(current===2){
      mainStage(`${picture('male-group.webp','group-image','width="348" height="260" fetchpriority="high"')}<div class="group-message"><h1>Calistenia Asiática: comece no seu ritmo</h1><p>Conheça uma proposta de exercícios em casa, organizada para quem quer começar ou retomar uma rotina de movimentos.</p></div>`,'group-stage',continueButton('Continuar'));
      return;
    }
    if(current===4){
      illustrationStep('male-exercise.webp','Descubra movimentos simples para incluir na sua rotina.','A proposta reúne movimentos de força e mobilidade para fazer em casa, com adaptações conforme seu nível e suas possibilidades.','landscape-info','CONTINUAR');return;
    }
    if(current===9){
      illustrationStep('male-app.webp','Treinos organizados para acompanhar pelo celular','Conheça exercícios de calistenia em casa com orientações para adaptar os movimentos ao seu nível. O tempo de cada sessão pode variar conforme a atividade.','short-info','Continuar');return;
    }
    if(current===15){
      illustrationStep('male-positive.webp','O seu ritmo faz parte do processo!','Adaptamos seu programa com alternativas para promover movimentos seguros e suaves. Caso sinta dor, respeite seus limites e procure orientação profissional.','short-info','Continuar');return;
    }
    if(current>=16&&current<=18){return renderSlider();}
    if(current===19){
      const value=answers.exactAge??'';
      mainStage(`<div class="content-wrap input-age"><h1>Qual é a sua idade?</h1><input type="number" min="18" max="100" name="age" data-age-number inputmode="numeric" placeholder="Digite sua idade" value="${escapeHTML(value)}" aria-label="Digite sua idade"><div class="soft-note"><b>ⓘ &nbsp; Perguntamos sua idade para personalizar seu plano</b><small>O nível de atividade e suas condições individuais importam mais do que apenas a sua idade.</small></div><p class="validation" aria-live="polite"></p><button type="button" class="primary" data-save-age ${!value?'disabled':''}>Próximo passo</button></div>`,'age-stage');return;
    }
    const q=reference[current];if(!q)return;
    const choices=optionsFor(q);
    if(current===3){
      mainStage(`<div class="photo-form"><h1>${q.title}</h1><div class="photo-form-choices">${choices}</div>${picture('male-hero.webp','quiz-woman','width="203" height="449"')}</div>`,'photo-stage');return;
    }
    if(current===10){
      const cards=q.items.map((title,i)=>{const sel=answers[q.key]===String(i);return `<button class="body-card ${sel?'selected':''}" data-single="${q.key}" data-value="${i}">${picture(['body-slim.webp','body-average.webp','body-overweight.webp','body-large.webp'][i],'body-card-img','width="148" height="140"')}<span>${title}</span></button>`;}).join('');
      mainStage(`<div class="content-wrap grid-content"><h1>${q.title}</h1><div class="body-grid">${cards}</div></div>`,'body-stage');return;
    }
    if(current===12){
      mainStage(`<div class="photo-form best-form-layout"><h1>${q.title}</h1><div class="photo-form-choices best-form-choices">${choices}</div>${picture('male-fitness.webp','quiz-woman best-form-image','width="320" height="478"')}</div>`,'photo-stage best-form-stage');return;
    }
    let selectionControl='';
    if(q.type==='multi'){
      const chosen=answers[q.key]||[];
      selectionControl=`<button type="button" class="primary" data-next ${chosen.length?'':'disabled'}>${current===7||current===8||current===13?'Próximo passo':'Continuar'}</button>`;
    }
    let special='';
    if(current===7){
      const checked=Array.isArray(answers[q.key]) && answers[q.key].includes('0');
      special=`<label class="toggle-all"><input type="checkbox" data-all-zone ${checked?'checked':''}><span>Melhorar o corpo inteiro</span></label>`;
    }
    const subtitle=q.subtitle?`<p class="subtitle">${q.subtitle}</p>`:'';
    // The first option of step 7 is the native toggle above rather than a duplicate card.
    const html=choices;
    mainStage(`<div class="content-wrap"><h1>${q.title}</h1>${subtitle}${special}<div class="choice-list ${q.symbols?'icon-choices':''} ${current===14?'emoji-choices':''}">${html}</div></div>`,'choices-stage '+(current===7?'long-list':''),selectionControl);
  }
  function renderSlider(){
    const height=current===16;
    const key=height?'height':current===17?'currentWeight':'targetWeight';
    const metric=height?'cm':'kg';const imperial=height?'pol':'Libra';
    const unit=String(answers[key+'_unit']||metric);
    const isMetric=unit===metric;
    const kgVal=Number(answers[key]??(height?165:current===17?73:57));
    const val=height?(isMetric?Math.round(kgVal):Math.round(kgVal/2.54)):isMetric?Math.round(kgVal):Math.round(kgVal*2.2046226);
    const min=height?(isMetric?120:47):(isMetric?30:66);
    const max=height?(isMetric?220:87):(isMetric?200:440);
    let note='';
    if(current===16)note='<span class="info-dot">ⓘ</span> Calculando seu IMC';
    if(current===17){
      const h=Number(answers.height||165)/100; const bmi=kgVal/(h*h);const cat=bmi<18.5?'abaixo do peso':bmi<25?'peso adequado':bmi<30?'sobrepeso':'obesidade';
      note=`Seu IMC aproximado é <b>${bmi.toFixed(1)}</b> — ${cat}. <small>O IMC é apenas um indicador geral e não descreve sozinho sua saúde.</small>`;
    }
    const title=height?'Qual é a sua altura?':current===17?'Qual é o seu peso agora?':'Qual é o seu peso alvo?';
    mainStage(`<div class="content-wrap ruler-block"><h1>${title}</h1><div class="unit-toggle"><button type="button" data-unit="${metric}" data-for="${key}" class="${isMetric?'active':''}">${metric}</button><button type="button" data-unit="${imperial}" data-for="${key}" class="${!isMetric?'active':''}">${imperial}</button></div><div class="large-value"><output data-value-readout>${val}</output><small>${unit}</small></div><div class="ruler"><input type="range" min="${min}" max="${max}" step="1" value="${val}" data-ruler="${key}" data-metric="${metric}" aria-label="${title}"><span class="ruler-arrow">▲</span></div><div class="ruler-help">Arraste para ajustar</div>${note?`<div class="soft-note">${note}</div>`:''}<button class="primary" data-next type="button">Próximo passo</button></div>`,'ruler-stage');
  }
  function header(back=true) {return hdr(back);}
  function wrap(markup,cssClass='') { root.innerHTML=`<div class="page ${cssClass} slide-in">${header(current>1)}${markup}</div>`; }
  function introSplash() {
    root.innerHTML=`<div class="page" data-boot-quiz-lead><header class="hdr"><span class="hdr-logo">CALISTENIA</span><span class="hdr-badge">by Atlas</span></header><main class="quiz-lead-stage"><div class="quiz-lead-box"><h1>Calistenia Asiática: <span>um novo jeito de treinar em casa</span></h1><p>Conheça o programa de 21 dias, com exercícios de força e mobilidade que podem ser adaptados ao seu ritmo.</p><p>Os resultados variam de pessoa para pessoa. Responda às perguntas para conhecer a proposta.</p><button class="quiz-lead-button" type="button" data-begin-quiz>COMEÇAR O QUIZ</button></div></main></div>`;
  }
  function intro() {
    root.innerHTML=`<div class="page visual-reference" data-boot-intro><header class="hdr"><span class="hdr-logo">CALISTENIA</span><span class="hdr-badge">by Atlas</span></header><main class="main ref-landing ref-male-first"><img class="reference-banner" src="/pagina/images/reference-banner.webp" alt="Calistenia Asiática para homens iniciantes" width="800" height="300" fetchpriority="high"><h1 class="ref-intro-age">Selecione sua idade para começar 👇🏻</h1><img class="ref-male-person" src="/pagina/images/reference-hero.webp" alt="Praticante de calistenia" width="400" height="600" decoding="async" fetchpriority="high"><div class="ref-male-age-options">${['30 – 39 anos','40 – 49 anos','50 – 59 anos','+ 60 anos'].map(a=>`<button type="button" class="ref-age-btn" data-age="${a}"><span>${a}</span><span class="option-arrow">➜</span></button>`).join('')}</div><div class="ref-first-note">Faça esse teste e conheça uma proposta de exercícios para sua idade e rotina.</div><p class="ref-first-privacy">🔒 Suas respostas são privadas e usadas para organizar sua experiência no quiz.</p></main></div>`;
  }
  function screenText(title,desc,content) {
    wrap(`<main class="stage"><h1>${escapeHTML(title)}</h1><p class="desc">${escapeHTML(desc)}</p>${content}</main>`);
  }
  function renderQuestion(step) {
    if(current===20){
      const opts=[['sentada','Passo boa parte do tempo sentada'],['movimento','Caminho ou me movimento durante o dia'],['ativa','Tenho uma rotina bastante ativa']];
      const values=opts.map(([value,label])=>`<button type="button" class="choice ${answers.lifestyle===value?'selected':''}" data-single="lifestyle" data-value="${value}" aria-pressed="${answers.lifestyle===value?'true':'false'}"><span>${label}</span><span>›</span></button>`).join('');
      wrap(`<main class="stage stage-compact"><h1>Como é seu dia a dia?</h1><p class="desc">Escolha a resposta que combina mais com sua rotina.</p><div class="choice-list">${values}</div></main>`);
      return;
    }
    if(current===21){
      const items=[['baixa','🔋','Frequentemente me sinto sem energia'],['media','🌤️','Minha energia varia ao longo do dia'],['alta','⚡','Geralmente tenho boa disposição']];
      const values=items.map(([value,icon,label])=>`<button type="button" class="choice icon-choice ${answers.energyLevel===value?'selected':''}" data-single="energyLevel" data-value="${value}" aria-pressed="${answers.energyLevel===value?'true':'false'}"><span class="mini-icon">${icon}</span><span>${label}</span><span>›</span></button>`).join('');
      wrap(`<main class="stage stage-compact"><h1>Como costuma estar sua disposição?</h1><p class="desc">Considere seu dia a dia, não apenas agora.</p><div class="choice-list">${values}</div></main>`);
      return;
    }
    if(current===22){
      const opts=[['pouca','Bebo pouca água'],['moderada','Bebo uma quantidade moderada'],['boa','Costumo me hidratar bem']];
      const values=opts.map(([value,label])=>`<button type="button" class="choice ${answers.waterIntake===value?'selected':''}" data-single="waterIntake" data-value="${value}" aria-pressed="${answers.waterIntake===value?'true':'false'}"><span>${label}</span><span>›</span></button>`).join('');
      wrap(`<main class="stage media-stage water-stage"><h1>Como está seu consumo de água?</h1><p class="desc">A hidratação faz parte da rotina de exercícios.</p><div class="media-split"><div class="media-options">${values}</div><img class="media-figure water-figure" src="/pagina/images/hidratacao.svg" alt="Ilustração de um copo de água" width="1000" height="710" loading="lazy" decoding="async"></div></main>`);
      return;
    }
    if(current===23){
      const opts=[['menos6','Menos de 6 horas'],['6a7','Entre 6 e 7 horas'],['7a9','Entre 7 e 9 horas'],['mais9','Mais de 9 horas']];
      const values=opts.map(([value,label])=>`<button type="button" class="sleep-card ${answers.sleepDuration===value?'selected':''}" data-single="sleepDuration" data-value="${value}" aria-pressed="${answers.sleepDuration===value?'true':'false'}"><span>${label}</span></button>`).join('');
      wrap(`<main class="stage sleep-stage"><h1>Quantas horas você costuma dormir?</h1><img class="sleep-image" src="/pagina/images/sono.svg" alt="Ilustração de sono" width="671" height="1000" loading="lazy" decoding="async"><div class="sleep-grid">${values}</div></main>`);
      return;
    }
    if(current===24){
      const items=[
        ['vegetariana','refeicao.svg','Eu sou vegetariana','Verduras, grãos, mas sem carne animal'],
        ['vegana','refeicao.svg','Eu sou vegana','Puramente à base de plantas, sem produtos de origem animal'],
        ['gluten','refeicao.svg','Não contém glúten','Excluir produtos de grãos que contenham glúten'],
        ['lactose','refeicao.svg','Sem lactose','Excluir produtos lácteos'],
        ['semrestricoes','refeicao.svg','Sem restrições','Aberto a todos os alimentos']
      ];
      const chosen=Array.isArray(answers.mealPreferences)?answers.mealPreferences:[];
      const values=items.map(([value,img,title,desc])=>`<button type="button" class="meal-card ${chosen.includes(value)?'selected':''}" data-multi="mealPreferences" data-value="${value}" aria-pressed="${chosen.includes(value)?'true':'false'}"><img class="meal-thumb" src="/pagina/images/${img}" alt="" width="64" height="64" loading="lazy" decoding="async"><span class="meal-copy"><strong>${title}</strong><small>${desc}</small></span><span class="option-check">${chosen.includes(value)?'✓':''}</span></button>`).join('');
      wrap(`<main class="stage meal-stage"><h1>Quais são suas preferências de refeição?</h1><div class="meal-list">${values}</div><div class="sticky-continue"><button type="button" class="primary" data-next ${chosen.length?'':'disabled'}>Continuar</button></div></main>`);
      return;
    }
    if(current===25){
      const items=[
        ['procrastinacao','⏰','Procrastinação'],
        ['alimentacao','🍔','Alimentação pouco saudável'],
        ['midias','📱','Mídias sociais'],
        ['cafeina','☕','Beber muita cafeína'],
        ['series','📺','Maratona de séries']
      ];
      const chosen=Array.isArray(answers.habits)?answers.habits:[];
      const values=items.map(([value,icon,label])=>`<button type="button" class="habit-card ${chosen.includes(value)?'selected':''}" data-multi="habits" data-value="${value}" aria-pressed="${chosen.includes(value)?'true':'false'}"><span class="habit-icon">${icon}</span><span class="habit-label">${label}</span><span class="option-check">${chosen.includes(value)?'✓':''}</span></button>`).join('');
      wrap(`<main class="stage habits-stage"><h1>Quais desses hábitos você tem?</h1><div class="habits-list">${values}</div><div class="sticky-continue"><button type="button" class="primary" data-next ${chosen.length?'':'disabled'}>Continuar</button></div></main>`);
      return;
    }
    if (step.type==='info') {
      let detail='';
      if(current===31) detail=`<div class="panel"><h2>Seu ponto de partida</h2><ul class="list-check"><li>Idade informada: ${escapeHTML(answers.exactAge||'não informada')}</li><li>Foco: ${escapeHTML((reference[5].items||[])[Number(answers.mainGoal)]||'movimento e bem-estar')}</li><li>Programa progressivo de 21 dias em casa</li></ul></div>`;
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
    let startedAt;
    try { startedAt=Number(sessionStorage.getItem(OFFER_START_KEY)); } catch (_) {}
    if (!Number.isFinite(startedAt) || startedAt <= 0 || startedAt > Date.now()) {
      startedAt=Date.now();
      try { sessionStorage.setItem(OFFER_START_KEY,String(startedAt)); } catch (_) {}
    }
    const href=escapeHTML(checkoutHref());
    const offerFeatures=[
      ['Plano de Calistenia Asiática em Casa','Uma sequência de exercícios organizada para acompanhar no celular.'],
      ['Exercícios progressivos','Atividades de força e mobilidade para adaptar ao seu nível.'],
      ['Programa de 21 dias','Uma estrutura diária para ajudar a organizar a prática.'],
      ['Orientações para começar','Informações para seguir seu ritmo e respeitar limites.'],
      ['Mobilidade e condicionamento','Movimentos para diferentes partes do corpo.'],
      ['Acesso pelo aplicativo','Confira as atividades de maneira prática pelo celular.']
    ];
    const buy = (text='OBTER MEU PROGRAMA AGORA')=>`<a class="offer-blue-buy" href="${href}" data-checkout rel="noopener noreferrer">${text} →</a>`;
    const payCard=()=>`<section class="offer-blue-price" aria-label="Condição de compra"><p class="offer-blue-price-note">Acesso ao programa</p><div class="offer-blue-price-number"><small>por</small> R$ 57,90</div><p>Pagamento único • acesso ao programa de 21 dias</p><p class="offer-blue-safe">🔒 Pagamento processado pela Mivvo</p></section>`;
    const unlockArea=()=>`<div class="offer-gated" data-gated-cta hidden>${buy()}</div>`;
    wrap(`<main class="offer-blue-page">
      <div class="offer-blue-top"><span>CALISTENIA <small>by Atlas</small></span></div>
      <div class="offer-blue-body">
        <h1>Seu plano de <strong>Calistenia Asiática</strong> está <em>pronto!</em></h1>
        <p class="offer-blue-sub">Assista ao vídeo abaixo e veja como funciona o programa.</p>
        <div class="offer-video-wrap"><vturb-smartplayer id="vid-6afba5f7d4334aee81183338" style="display:block;margin:0 auto;width:100%;max-width:400px"><div class="vturb-player-placeholder" style="position:relative;width:100%;padding:178.21782178217822% 0 0;z-index:0;background-color:black"></div></vturb-smartplayer></div>
        ${unlockArea()}
        <section class="offer-blue-section"><h2>O que você vai receber</h2><div class="offer-blue-feature-list">${offerFeatures.map(([title,desc])=>`<div class="offer-blue-feature"><span>✓</span><p><strong>${title}:</strong> ${desc}</p></div>`).join('')}</div></section>
        <section class="offer-blue-app"><h2>Aplicativo fácil de usar e feito <em>para iniciantes!</em></h2><img src="/pagina/images/male-app.webp" alt="Demonstração visual de exercícios no aplicativo" width="600" height="450" loading="lazy" decoding="async"><p>Consulte os exercícios e acompanhe a sequência do programa diretamente pelo celular.</p></section>
        <section class="offer-purchase-section">${payCard()}${unlockArea()}</section>
        <section class="offer-blue-section"><h2>Conheça melhor o programa</h2><img class="offer-blue-wide-photo" src="/pagina/images/male-exercise.webp" alt="Exercício de calistenia demonstrado por um homem" width="600" height="400" loading="lazy" decoding="async"><p class="offer-blue-copy">Movimentos de força, mobilidade e condicionamento que você pode experimentar em casa. A intensidade varia conforme a sua experiência e condição física.</p></section>
        <section class="offer-blue-section offer-blue-feedback"><h2>Experiências de participantes</h2><p>Aqui você pode apresentar avaliações autênticas, autorizadas e verificáveis de quem utilizou o seu programa. Nenhum depoimento ou resultado individual foi inventado nesta versão.</p></section>
        <section class="offer-blue-section offer-extra-bonuses" aria-label="Materiais complementares">
          <h2>🎁 + BÔNUS <em>EXCLUSIVOS</em></h2>
          <p class="offer-blue-copy">Conheça os materiais complementares relacionados à sua rotina. Confira a disponibilidade de cada item na descrição da compra.</p>
          <div class="offer-bonus-stack">
            <article class="offer-bonus-item"><span class="offer-bonus-num">1</span><span class="offer-bonus-icon" aria-hidden="true">☾</span><div><strong>ROTINA NOTURNA DE RELAXAMENTO</strong><p>Ideias de alongamentos suaves e preparação para um descanso mais tranquilo.</p></div></article>
            <article class="offer-bonus-item"><span class="offer-bonus-num">2</span><span class="offer-bonus-icon" aria-hidden="true">🥗</span><div><strong>GUIA DE REFEIÇÕES PRÁTICAS</strong><p>Sugestões simples para organizar refeições e cuidar dos hábitos alimentares.</p></div></article>
            <article class="offer-bonus-item"><span class="offer-bonus-num">3</span><span class="offer-bonus-icon" aria-hidden="true">⚡</span><div><strong>GUIA DE CONSTÂNCIA</strong><p>Dicas para manter a motivação e encaixar exercícios na rotina.</p></div></article>
            <article class="offer-bonus-item"><span class="offer-bonus-num">4</span><span class="offer-bonus-icon" aria-hidden="true">🎧</span><div><strong>ORIENTAÇÕES E SUPORTE</strong><p>Consulte os canais de atendimento e as condições de suporte disponíveis após a compra.</p></div></article>
          </div>
        </section>
        <section class="offer-guarantee" aria-label="Informações sobre garantia">
          <div class="offer-guarantee-mark" aria-hidden="true">✓</div>
          <h2>Garantia de <em>30 dias</em></h2>
          <p>Confira no checkout as condições de reembolso e garantia aplicáveis ao seu pedido antes de finalizar a compra.</p>
        </section>
        <section class="offer-blue-section offer-week-plan" aria-label="Como funciona o programa">
          <h2>O que esperar nas próximas <em>3 semanas</em></h2>
          <div class="offer-weeks">
            <div><b>1</b><p><strong>Semana 1 — Primeiros movimentos:</strong> familiarize-se com os exercícios e com as adaptações para o seu ritmo.</p></div>
            <div><b>2</b><p><strong>Semana 2 — Desenvolvimento da rotina:</strong> acompanhe as atividades de força e mobilidade e observe seu conforto.</p></div>
            <div><b>3</b><p><strong>Semana 3 — Continuidade:</strong> consolide o hábito, ajuste a intensidade e avalie sua experiência.</p></div>
          </div>
        </section>
        <section class="offer-blue-section offer-faq" aria-label="Perguntas frequentes">
          <h2>Perguntas<br>Frequentes</h2>
          <details open><summary><span>🟢</span> Eu nunca fiz Calistenia, é para iniciantes?</summary><p>Sim. O programa apresenta uma sequência inicial com orientações e opções para adaptar os movimentos ao seu nível.</p></details>
          <details><summary><span>🟢</span> Quanto tempo preciso dedicar aos exercícios?</summary><p>O tempo varia conforme a aula e seu ritmo. Consulte a duração de cada atividade no aplicativo e respeite seus limites.</p></details>
          <details><summary><span>🟢</span> Preciso de algum equipamento?</summary><p>Muitos movimentos usam o peso do corpo e um espaço livre. Algumas atividades podem utilizar apoio estável, conforme as orientações da aula.</p></details>
          <details><summary><span>🟢</span> Como vou receber as aulas?</summary><p>O acesso é digital. Confira no checkout e no e-mail de confirmação as instruções de acesso correspondentes à sua compra.</p></details>
          <details><summary><span>🟢</span> E se eu tiver alguma dúvida sobre os exercícios?</summary><p>Consulte as instruções do aplicativo e os canais oficiais de suporte informados após a compra. Se sentir dor, interrompa e procure orientação profissional.</p></details>
        </section>
        <section class="offer-purchase-section offer-final-checkout">${payCard()}${unlockArea()}
          <p class="offer-blue-disclaimer">Pagamento único. Confira preço, formas de pagamento e condições de garantia no checkout Mivvo. Os resultados variam de pessoa para pessoa e o programa não substitui avaliação profissional.</p>
        </section>
      </div>
    </main>`,'offer');
    attachVTurb();
    const revealOffer=()=>{
      if(current!==35){if(offerUnlockTimer)clearTimeout(offerUnlockTimer);offerUnlockTimer=null;return;}
      const remaining=OFFER_UNLOCK_MS-(Date.now()-startedAt);
      if(remaining>0){offerUnlockTimer=setTimeout(revealOffer,Math.min(remaining,1000));return;}
      offerUnlockTimer=null;
      root.querySelectorAll('[data-gated-cta]').forEach(slot=>{slot.hidden=false;});
    };
    revealOffer();
  }

  /* Etapas 2–20: reconstrução visual dos vinte prints enviados em sequência.
     A navegação, a oferta, o temporizador, as UTMs e os scripts de pagamento não são alterados. */
  function renderFirstTwenty(){
    const asset = (file,cls='',alt='')=>`<img src="/pagina/images/${file}" class="${cls}" alt="${alt}" loading="lazy" decoding="async">`;
    const bottom = (text='Continuar →',disabled=false)=>`<div class="ref20-bottom"><button type="button" class="ref20-cta" data-next ${disabled?'disabled':''}>${text}</button></div>`;
    const page=(title,content='',sub='',cls='',footer='')=>{
      const h=title?`<h1 class="ref20-title">${title}</h1>`:'';
      const description=sub?`<p class="ref20-sub">${sub}</p>`:'';
      wrap(`<main class="ref20 ${cls}">${h}${description}${content}${footer}</main>`,'ref20-page');
    };
    const choice=(key,label,value,{img='',icon='',desc='',multi=false,exclusive=false}={})=>{
      const sel=multi?(Array.isArray(answers[key])&&answers[key].includes(value)):answers[key]===value;
      const attr=multi?'data-multi':'data-single';
      const thumb=img?asset(img,'ref20-thumb',''):icon?`<span class="ref20-emoji">${icon}</span>`:'';
      return `<button type="button" class="ref20-choice ${thumb?'has-media':''} ${sel?'selected':''} ${exclusive?'exclusive':''}" ${attr}="${key}" data-value="${value}" aria-pressed="${sel?'true':'false'}">${thumb}<span class="ref20-option-name">${label}${desc?`<small>${desc}</small>`:''}</span><span class="${multi&&!exclusive?'ref20-check':'ref20-chevron'}">${multi&&!exclusive?(sel?'✓':''):'➜'}</span></button>`;
    };
    const multi=(key,items)=>items.map((x,i)=>choice(key,x.label,x.value??String(i),{img:x.img,icon:x.icon,multi:true,exclusive:x.exclusive})).join('');
    const selected=(key)=>Array.isArray(answers[key])&&answers[key].length>0;
    switch(current){
      case 2:
        page('',`${asset('male-group.webp','ref20-wide','Grupo de homens praticantes')}<h1 class="ref20-title tight">Eles conseguiram e <em>você também pode</em></h1><p class="ref20-statement">Conheça exercícios em casa para desenvolver força, mobilidade e uma rotina de movimento.</p><p class="ref20-small-flag">🔥 Comece no seu ritmo e conheça a proposta do programa.</p>`,'','ref20-info ref20-group',bottom('Continuar'));
        break;
      case 3:
        page('Você já experimentou a <em>calistenia asiática?</em>',`<div class="ref20-split ref20-left-image">${asset('male-coach.webp','ref20-side-image','Homem demonstrando exercício')}<div class="ref20-split-options">${choice('calistheniaExperience','Sim, já pratiquei','sim')}${choice('calistheniaExperience','Já ouvi falar','ouvi')}${choice('calistheniaExperience','Nunca fiz, mas tenho interesse','nunca')}</div></div>`,'Você não precisa de experiência para conhecer os exercícios.','ref20-questions');
        break;
      case 4:
        page('A Calistenia Asiática <em>é diferente da calistenia comum.</em>',`${asset('male-dip.webp','ref20-info-hero','Homem fazendo exercício com apoio numa cadeira')}<div class="ref20-note">Vou te apresentar movimentos para treinar em casa, usando o peso do próprio corpo.</div>`,'A proposta é trabalhar força e mobilidade com exercícios progressivos.','ref20-info',bottom('CONTINUAR →'));
        break;
      case 5:
        page('Qual objetivo é <em>mais importante</em> pra você hoje?',`<div class="ref20-options">${choice('mainGoal','Perder peso e melhorar a composição corporal','0',{img:'goal-loss.webp'})}${choice('mainGoal','Ganhar força e músculos','1',{img:'goal-muscle.webp'})}${choice('mainGoal','Ter mais saúde e disposição','2',{img:'goal-fitness.webp'})}</div>`,'','ref20-questions');
        break;
      case 6:
        page('Como você descreveria seu <em>corpo atual?</em>',`<div class="ref20-options tall">${choice('bodyType','Magro','0',{img:'body-slim.webp'})}${choice('bodyType','Falso magro','1',{img:'body-average.webp'})}${choice('bodyType','Um pouco acima do peso','2',{img:'body-overweight.webp'})}${choice('bodyType','Bem acima do peso','3',{img:'body-large.webp'})}</div>`,'','ref20-questions');
        break;
      case 7:
        {const opts=[{label:'Estou acima do peso há bastante tempo',value:'peso',icon:'⚖️'},{label:'Meu corpo vive dolorido e travado',value:'dor',icon:'😵'},{label:'Vivo cansado e sem energia',value:'cansaco',icon:'🥱'},{label:'Sinto uma queda na minha disposição',value:'disposicao',icon:'😕'},{label:'Durmo muito mal',value:'sono',icon:'😴'},{label:'Minha mente não desacelera',value:'mente',icon:'😮‍💨'},{label:'Só quero cuidar da saúde',value:'nenhum',exclusive:true}];page('Qual dessas situações mais te <span class="ref20-red">incomoda</span> hoje?',`<div class="ref20-options compact">${multi('discomforts',opts)}</div><p class="ref20-private">🔒 Seus dados são privados e protegidos</p>`,'Selecione todas as opções aplicáveis.','ref20-questions',bottom('Continuar →',!selected('discomforts')));break;}
      case 8:
        page('Qual é o corpo que você <em>deseja ter?</em>',`<div class="ref20-options tall">${choice('dreamBody','Magro','0',{img:'body-slim.webp'})}${choice('dreamBody','Definido','1',{img:'body-dream.webp'})}${choice('dreamBody','Forte e volumoso','2',{img:'male-abs.webp'})}</div>`,'','ref20-questions');
        break;
      case 9:
        {const opts=[{label:'Barriga grande',value:'abdomen',img:'region-belly.webp'},{label:'Peitoral caído',value:'peito',img:'region-chest.webp'},{label:'Braços finos',value:'bracos',img:'region-shoulder.webp'},{label:'Pernas finas',value:'pernas',img:'region-legs.webp'}];page('Quais são as áreas que você <em>quer focar primeiro?</em>',`<div class="ref20-options tall">${multi('targetZones',opts)}</div>`,'Escolha todas que se aplicam.','ref20-questions',bottom('Continuar →',!selected('targetZones')));break;}
      case 10:
        page('',`${asset('male-app.webp','ref20-app-image','Prévia ilustrativa do aplicativo')}<h1 class="ref20-title tight">Conheça uma rotina de <em>exercícios em casa</em></h1><p class="ref20-statement">O programa reúne aulas e orientações para trabalhar força e mobilidade, respeitando seu ritmo.</p>`,'','ref20-info',bottom('Continuar →'));
        break;
      case 11:
        page('',`${asset('male-lunge.webp','ref20-wide','Homem praticando calistenia ao ar livre')}<h1 class="ref20-title tight">Exercícios para <em>fortalecer o corpo</em> sem sair de casa</h1><p class="ref20-statement">Com movimentos progressivos, você pode incluir a calistenia na sua rotina. O tempo de treino varia conforme a atividade.</p>`,'','ref20-info',bottom('Criar meu treino personalizado →'));
        break;
      case 12:
        page('Com que <em>frequência</em> você se exercita?',`<div class="ref20-options">${choice('exerciseFrequency','Quase todos os dias','diario')}${choice('exerciseFrequency','Algumas vezes por semana','semanal')}${choice('exerciseFrequency','Algumas vezes por mês','mensal')}${choice('exerciseFrequency','Nunca','nunca')}</div>`,'','ref20-questions');
        break;
      case 13:
        page('Você se sente <em>confortável</em> fazendo esse movimento?',`${asset('male-squat.webp','ref20-wide exercise','Homem realizando agachamento')}<div class="ref20-options">${choice('squatComfort','Não','nao')}${choice('squatComfort','Sim','sim')}</div>`,'','ref20-questions');
        break;
      case 14:
        page('Quantas <em>flexões</em> você consegue fazer seguidas?',`${asset('male-exercise.webp','ref20-wide exercise','Homem fazendo flexões')}<div class="ref20-options">${choice('pushupAbility','Não consigo fazer flexões','0')}${choice('pushupAbility','1 – 10 flexões','1-10')}${choice('pushupAbility','11 – 20 flexões','11-20')}${choice('pushupAbility','Mais de 20 flexões','20+')}</div>`,'','ref20-questions');
        break;
      case 15:
        page('Quão <em>flexível</em> você é?',`${asset('male-stretch.webp','ref20-wide exercise','Homem alongando o corpo')}<div class="ref20-options">${choice('flexibility','Muito flexível','muito')}${choice('flexibility','Um pouco flexível','pouco')}${choice('flexibility','Sou travado','travado')}${choice('flexibility','Não tenho certeza','naosei')}</div>`,'','ref20-questions');
        break;
      case 16:
        page('Como você descreveria um <em>dia comum</em> seu?',`<div class="ref20-options">${choice('dailyActivity','Fico a maior parte do tempo parado','parado',{icon:'🪑'})}${choice('dailyActivity','Me movimento um pouco','pouco',{icon:'👟'})}${choice('dailyActivity','Sou ativo na maior parte do tempo','ativo',{icon:'🏃'})}</div><p class="ref20-hint">A rotina ajuda a entender o ponto de partida de cada pessoa.</p>`,'','ref20-questions');
        break;
      case 17:
        page('E como seu peso <em>costuma mudar?</em>',`<div class="ref20-options">${choice('weightPattern','Engordo fácil, mas emagreço devagar','lento')}${choice('weightPattern','Engordo fácil e emagreço fácil','oscilante')}${choice('weightPattern','Tenho dificuldade para ganhar peso ou massa muscular','ganhar')}</div>`,'','ref20-questions');
        break;
      case 18:
        {
          // A tela ilustrativa acompanha a resposta da etapa 17. Esta associação
          // é apenas um recurso de personalização do quiz, não um diagnóstico corporal.
          const profiles={
            lento:{name:'Endomorfo',image:'body-large.webp',description:'Você relatou que tende a ganhar peso com facilidade e que costuma perdê-lo mais devagar.'},
            oscilante:{name:'Mesomorfo',image:'body-toned.webp',description:'Você relatou facilidade tanto para ganhar quanto para perder peso.'},
            ganhar:{name:'Ectomorfo',image:'body-slim.webp',description:'Você relatou dificuldade para ganhar peso ou massa muscular.'}
          };
          const key=answers.weightPattern;
          const profile=profiles[key];
          if(!profile){
            page('Vamos conhecer seu <em>ponto de partida</em>',`<p class="ref20-statement">Responda à pergunta sobre mudanças de peso para ver seu perfil ilustrativo.</p>`,'','ref20-info',`<div class="ref20-bottom"><button type="button" class="ref20-cta" data-back>Voltar à pergunta anterior</button></div>`);
            break;
          }
          const order=['ganhar','oscilante','lento'];
          const cards=order.map(id=>{
            const item=profiles[id],active=id===key;
            return `<div class="ref20-type-card ${active?'is-active':'is-muted'}" aria-label="${item.name}${active?' — perfil ilustrativo selecionado':''}">${asset(item.image,'ref20-type-image',item.name)}<span>${item.name}</span></div>`;
          }).join('');
          page(`Seu perfil ilustrativo: <em>${profile.name}</em>`,`<p class="ref20-type-description">${profile.description}</p><p class="ref20-type-disclaimer">Essa classificação é apenas ilustrativa. A resposta não determina seu tipo físico nem seus resultados.</p><div class="ref20-type-grid">${cards}</div><p class="ref20-type-caption">Vamos considerar seu ritmo e seus objetivos para apresentar os exercícios.</p>`,'','ref20-info ref20-bodyinfo ref20-type-stage',bottom('Continuar →'));
        }
        break;
      case 19:
        page('Quando foi a última vez que <em>sentiu orgulho</em> do seu corpo?',`<div class="ref20-split left-pride">${asset('male-fitness.webp','ref20-side-image pride-image','Homem praticante')}<div class="ref20-split-options">${choice('fitnessHistory','Menos de 1 ano atrás','menos1')}${choice('fitnessHistory','1 – 3 anos atrás','1-3')}${choice('fitnessHistory','Mais de 3 anos','mais3')}${choice('fitnessHistory','Nem me lembro','nunca')}</div></div>`,'','ref20-questions');
        break;
      case 20:
        {const opts=[{label:'Costas/lombar',value:'costas',img:'region-back.webp'},{label:'Joelhos/pernas',value:'joelhos',img:'region-knee.webp'},{label:'Nenhuma dessas',value:'nenhum',exclusive:true}];page('Você sente algum <span class="ref20-red">desconforto ou dor</span> em alguma destas áreas?',`<div class="ref20-options">${multi('painAreas',opts)}</div>`,'Para exercícios que provoquem dor, procure orientação de um profissional de saúde.','ref20-questions',bottom('Continuar →',!selected('painAreas')));break;}
    }
  }

  /* Etapas 21–34: reconstrução responsiva a partir dos prints adicionais.
     Os números de medida e IMC vêm das respostas reais, sem estimativas clínicas ou promessas de emagrecimento. */
  let resultProfileShown=false;
  let nextResultStage="summary";
  const photoNext = (name,cls='',alt='')=>`<img src="/pagina/images/${name}" alt="${escapeHTML(alt)}" class="${cls}" loading="lazy" decoding="async">`;
  const nextFooter = (label='Continuar →',disabled=false,extra='')=>`<div class="next-footer"><button type="button" class="next-cta" ${extra||'data-next'} ${disabled?'disabled':''}>${label}</button></div>`;
  const nextOption = (key,value,label,icon='',img='',mode='single',desc='')=>{
    const active=mode==='multi'?Array.isArray(answers[key])&&answers[key].includes(value):answers[key]===value;
    return `<button type="button" class="next-option ${img?'with-photo':''} ${active?'is-selected':''}" data-${mode}="${key}" data-value="${value}" aria-pressed="${active}">${img?photoNext(img,'next-opt-photo'):icon?`<span class="next-opt-icon">${icon}</span>`:''}<span class="next-opt-copy">${label}${desc?`<small>${desc}</small>`:''}</span><span class="next-opt-end">${mode==='multi'?(active?'☑':'□'):'→'}</span></button>`;
  };
  function nextPage(title,inner,desc='',footer='',cls=''){
    wrap(`<main class="next-page ${cls}"><h1 class="next-title">${title}</h1>${desc?`<p class="next-desc">${desc}</p>`:''}${inner}${footer}</main>`,'next-page-shell');
  }
  function nextMeasure(step){
    const conf={25:['height','Qual é a sua altura?','cm','pol',120,220,180],26:['currentWeight','Qual é o seu peso atual?','kg','lb',35,210,70],27:['targetWeight','E qual peso você quer chegar?','kg','lb',35,210,70]}[step];
    const [key,title,mainUnit,otherUnit,min,max,fallback]=conf;
    const unit=answers[key+'_displayUnit']||mainUnit;
    const stored=Number(answers[key]);
    const valid=Number.isFinite(stored)&&stored>0?stored:fallback;
    const imperial=unit===otherUnit;
    const minimum=imperial?Math.round(min*(key==='height'?0.393701:2.20462)):min;
    const maximum=imperial?Math.round(max*(key==='height'?0.393701:2.20462)):max;
    const display=Math.round(imperial?valid*(key==='height'?0.393701:2.20462):valid);
    const safeDisplay=Math.max(minimum,Math.min(maximum,display));
    const caption=step===25?'Sua altura ajuda a adaptar os movimentos e a amplitude dos exercícios.':step===26?'Este valor será utilizado apenas para montar o seu resumo pessoal.':'É uma referência escolhida por você, não uma promessa de resultado do programa.';
    nextPage(title,`<div class="next-unit-switch"><button type="button" class="${!imperial?'active':''}" data-display-unit="${mainUnit}" data-for="${key}">${mainUnit}</button><button type="button" class="${imperial?'active':''}" data-display-unit="${otherUnit}" data-for="${key}">${otherUnit}</button></div><div class="next-measure-number"><output data-measure-output>${safeDisplay}</output><small>${unit}</small></div><div class="next-measure-slider"><input aria-label="Ajustar ${escapeHTML(title)}" data-next-range="${key}" min="${minimum}" max="${maximum}" step="1" value="${safeDisplay}" type="range"><span class="next-slider-arrow">▲</span><div class="next-range-ends"><span>${minimum}</span><span>${Math.round((minimum+maximum)/2)}</span><span>${maximum}</span></div></div><p class="next-adjust">Arraste para ajustar</p>${step===25?'<p class="next-small-note">☝️ Calculando seu IMC...</p>':''}<p class="next-explainer">${caption}</p>`, '',nextFooter('Próximo passo →',false,'data-next-measure="'+key+'"'),'next-measure-stage');
  }
  function renderNextScreens(){
    switch(current){
      case 21:
        nextPage('Como costuma estar sua <em>disposição?</em>',`<div class="next-options">${nextOption('energyBefore','baixa','Frequentemente me sinto sem energia','🔋')}${nextOption('energyBefore','media','Minha energia varia ao longo do dia','🌤️')}${nextOption('energyBefore','alta','Geralmente tenho boa disposição','⚡')}</div>`,'Considere seu dia a dia, não apenas agora.');break;
      case 22:
        nextPage('A Calistenia Asiática <em>pode fazer parte da sua rotina</em>',`<div class="next-benefits-hero">${photoNext('male-coach.webp','next-benefit-man','Homem demonstrando exercício')}<span class="benefit-item b1">Mais energia</span><span class="benefit-item b2">Mobilidade</span><span class="benefit-item b3">Mais foco</span><span class="benefit-item b4">Bem-estar</span></div><p class="next-story">O programa reúne movimentos progressivos que você pode adaptar ao seu nível e praticar em casa.</p><div class="next-benefits-list"><div>🔵 <strong>Movimentos para fortalecer o corpo</strong> no próprio ritmo</div><div>🟢 <strong>Mobilidade e flexibilidade</strong> com exercícios progressivos</div><div>🟡 <strong>Rotina organizada</strong> para acompanhar pelo celular</div></div>`,'',nextFooter(),'next-story-page');break;
      case 23:
        nextPage('E como você prefere <em>começar</em> seu treino?',`<div class="next-options">${nextOption('trainingIntensity','leve','Bem leve','🌱')}${nextOption('trainingIntensity','intermediario','Intermediário','🌿')}${nextOption('trainingIntensity','ativo','Mais ativo','⚡')}${nextOption('trainingIntensity','decidir','Prefiro que vocês decidam','💪')}</div>`,'Você pode mudar isso depois.');break;
      case 24:{
        const variants={leve:['Bem leve','Você escolheu começar em um ritmo tranquilo.'],intermediario:['Intermediário','Você escolheu um ritmo equilibrado.'],ativo:['Mais ativo','Você escolheu uma rotina mais ativa.'],decidir:['Adaptável','Você prefere escolher a intensidade durante o programa.']};
        const [label,desc]=variants[answers.trainingIntensity]||variants.decidir;
        const week=[['SEMANA 1','male-fitness.webp','Conheça os movimentos e explore seu ritmo.'],['SEMANA 2','male-lunge.webp','Inclua mobilidade e repetições adaptadas.'],['SEMANA 3','male-abs.webp','Acompanhe sua consistência e técnica.'],['SEMANA 4','male-stretch.webp','Continue seu hábito, se desejar.']];
        nextPage('Ótimo, seu treino pode começar assim: <em>'+label+'</em>',`<div class="next-info-blue">${desc} O aplicativo permite acompanhar os exercícios de forma progressiva.</div><div class="next-week-grid">${week.map(([w,img,body])=>`<div class="next-week-card">${photoNext(img,'',w)}<strong>${w}</strong><p>${body}</p></div>`).join('')}</div>`,'',nextFooter(),'next-weeks-stage');break;}
      case 25:case 26:case 27:nextMeasure(current);break;
      case 28:
        nextPage('Quanto de água <em>você bebe diariamente?</em>',`<div class="next-options">${nextOption('waterIntake','cha','Eu só tomo café ou chá','☕')}${nextOption('waterIntake','pouca','Bebo pouca água','💧')}${nextOption('waterIntake','moderada','Uma boa quantidade','💦')}${nextOption('waterIntake','boa','Bebo água o dia inteiro','🚰')}</div>`);break;
      case 29:
        nextPage('Quantas <em>horas de sono</em> você costuma ter?',`<div class="next-options">${nextOption('sleepDuration','menos5','Menos de 5 horas','😵')}${nextOption('sleepDuration','5a6','5 – 6 horas','🥱')}${nextOption('sleepDuration','7a8','7 – 8 horas','🌜')}${nextOption('sleepDuration','mais8','Mais de 8 horas','😴')}</div>`);break;
      case 30:{
        const opts=[['semrestricoes','Sem restrições: Aberto a todos os alimentos','meal-all.webp'],['vegetariana','Eu sou vegetariano: Verduras, grãos, mas sem carne animal','meal-vegetarian.webp'],['vegana','Eu sou vegano: À base de plantas, sem produtos de origem animal','meal-vegan.webp'],['gluten','Sem glúten: Excluo alimentos que contêm glúten','meal-glutenfree.webp'],['lactose','Sem lactose: Excluo produtos lácteos','meal-lactose.webp']];
        nextPage('Quais são suas <em>preferências alimentares?</em>',`<div class="next-options next-meal-options">${opts.map(([val,label,img])=>nextOption('mealPreferences',val,label,'',img)).join('')}</div>`);break;}
      case 31:
        nextPage('Como estão seus <em>níveis de energia</em> durante o dia?',`<div class="next-options">${nextOption('energyLevel','baixa','Me sinto exausto a maior parte do tempo','😳')}${nextOption('energyLevel','media','Variam ao longo do dia','😮‍💨')}${nextOption('energyLevel','alta','Geralmente sou muito ativo','⚡')}</div>`);break;
      case 32:{
        nextPage('É assim que a <em>evolução da sua rotina</em> pode acontecer',`<p class="next-story">Seu progresso depende de frequência, intensidade e adaptação. Este gráfico é uma <strong>ilustração</strong> da construção de um hábito, não uma previsão de resultados.</p><div class="next-chart-card"><p>Possíveis trajetórias de constância</p><svg viewBox="0 0 340 240" role="img" aria-label="Gráfico ilustrativo de duas rotinas: constância crescente e rotina irregular"><line x1="25" y1="195" x2="325" y2="195" stroke="#dce3ef"/><line x1="25" y1="38" x2="25" y2="195" stroke="#dce3ef"/><path class="next-graph-green" d="M25 195 C85 195 98 155 137 142 S205 45 255 50 S305 48 320 45" fill="none" stroke="#17ba89" stroke-width="4"/><path class="next-graph-red" d="M25 195 C93 193 105 191 158 190 S264 186 320 178" fill="none" stroke="#ef505d" stroke-width="4"/><circle cx="25" cy="195" r="5" fill="#fff" stroke="#087cff" stroke-width="3"/><circle cx="320" cy="45" r="5" fill="#fff" stroke="#17ba89" stroke-width="3"/><circle cx="320" cy="178" r="5" fill="#fff" stroke="#ef505d" stroke-width="3"/><rect x="180" y="66" width="139" height="27" rx="5" fill="#17ba89"/><text x="249" y="84" text-anchor="middle" font-size="10" font-weight="800" fill="white">Rotina consistente</text><rect x="179" y="148" width="141" height="25" rx="5" fill="#ef505d"/><text x="249" y="164" text-anchor="middle" font-size="10" font-weight="800" fill="white">Rotina irregular</text><text x="27" y="221" font-size="12" font-weight="700" fill="#39404d">Início</text><text x="291" y="221" font-size="12" font-weight="700" fill="#39404d">Tempo</text></svg></div>`,'',nextFooter('Concluir meu teste →'),'next-chart-stage');break;}
      case 33:{
        const age=answers.exactAge?`${Math.round(Number(answers.exactAge))} anos`:'idade não informada';
        nextPage('Estamos organizando <em>seu plano personalizado</em>',`<div class="next-loading-track"><div class="next-loading-fill"></div></div><p class="next-loading-label">Organizando seus dados</p><div class="next-loading-points"><div>✓ Preferência de intensidade: <strong>${escapeHTML(answers.trainingIntensity||'adaptável')}</strong></div><div>✓ Objetivo informado: <strong>${escapeHTML(answers.mainGoal||'movimento')}</strong></div><div>✓ Idade: <strong>${escapeHTML(age)}</strong></div></div><p class="next-story">As informações serão utilizadas para apresentar o programa. Elas não permitem prever resultados físicos.</p>`,'',nextFooter('Ver meu resumo →'),'next-loading-stage');break;}
      case 34:{
        const h=Number(answers.height),w=Number(answers.currentWeight),goal=Number(answers.targetWeight);
        const hasBody=Number.isFinite(h)&&h>=120&&Number.isFinite(w)&&w>0;
        const bmi=hasBody?w/((h/100)**2):null;
        const bmiStr=bmi!==null?bmi.toFixed(1).replace('.',','):'—';
        const marker=bmi===null?50:Math.max(0,Math.min(100,((bmi-15)/25)*100));
        if(nextResultStage==="summary"){
          const weightText=Number.isFinite(w)&&w>0?`${Math.round(w)} kg`:'não informado';
          const goalText=Number.isFinite(goal)&&goal>0?`${Math.round(goal)} kg`:'não informado';
          nextPage('Seu <em>resumo está pronto!</em>',`<p class="next-story">Você informou peso atual de <strong>${escapeHTML(weightText)}</strong> e referência de <strong>${escapeHTML(goalText)}</strong>.</p><div class="next-summary-graph"><h2>Suas medidas de referência</h2><svg class="next-personal-chart" viewBox="0 0 340 165" role="img" aria-label="Comparação visual do peso informado e do peso de referência escolhido"><line x1="25" x2="315" y1="125" y2="125" stroke="#dae2f1" stroke-width="1"/><rect x="80" y="${Math.round(125-88*(w>0?w:70)/Math.max(w>0?w:70,goal>0?goal:70))}" width="56" height="${Math.round(88*(w>0?w:70)/Math.max(w>0?w:70,goal>0?goal:70))}" rx="7" fill="#087cff" class="next-weight-bar"/><rect x="209" y="${Math.round(125-88*(goal>0?goal:70)/Math.max(w>0?w:70,goal>0?goal:70))}" width="56" height="${Math.round(88*(goal>0?goal:70)/Math.max(w>0?w:70,goal>0?goal:70))}" rx="7" fill="#57aef0" class="next-weight-bar"/><text x="108" y="143" font-size="11" fill="#485262" text-anchor="middle">Atual</text><text x="237" y="143" font-size="11" fill="#485262" text-anchor="middle">Referência</text><text x="108" y="25" font-size="13" font-weight="800" fill="#1f2a39" text-anchor="middle">${Math.round(w>0?w:70)} kg</text><text x="237" y="25" font-size="13" font-weight="800" fill="#1f2a39" text-anchor="middle">${Math.round(goal>0?goal:70)} kg</text></svg><div class="next-summary-bars"><div><span>Peso atual</span><strong>${escapeHTML(weightText)}</strong></div><div><span>Peso de referência</span><strong>${escapeHTML(goalText)}</strong></div></div><p>Esses valores são as respostas informadas por você, não uma previsão de perda de peso.</p></div><p class="next-story">Conheça agora seu resumo de perfil antes de ver a oferta.</p>`,'',nextFooter('Continuar →',false,'data-show-profile'),'next-summary-stage');
        } else if(nextResultStage==="profile") {
          nextPage('Seu <em>perfil está pronto!</em>',`<div class="next-profile-card"><h2>Índice de Massa Corporal (IMC)</h2><strong class="next-bmi">${bmiStr}</strong><div class="next-bmi-scale"><i style="left:${marker}%"></i></div><div class="next-bmi-labels"><span>15</span><span>18,5</span><span>25</span><span>30</span><span>40</span></div><small>${hasBody?'IMC calculado com os valores fornecidos. Não avalia composição corporal isoladamente.':'Informe altura e peso para calcular o IMC.'}</small></div><div class="next-profile-card"><h2>Sua rotina</h2><p>Preferência de treino: <strong>${escapeHTML(answers.trainingIntensity||'adaptável')}</strong></p><p>Atividade diária: <strong>${escapeHTML(answers.dailyActivity||'não informada')}</strong></p><p>Seu programa oferece exercícios progressivos para fazer em casa.</p></div><div class="next-info-blue">O quiz apresenta sugestões gerais e não substitui avaliação profissional de saúde.</div>`,'',nextFooter('Continuar →',false,'data-next-result'),'next-profile-stage');
        } else if(nextResultStage==="wellness") {
          nextPage('Descubra uma rotina de <em>movimento e bem-estar</em>',`<img class="offer-prep-image" src="/pagina/images/male-positive.webp" alt="Ilustração de benefícios de uma rotina de movimento" loading="lazy"><p class="next-story">Movimentar-se de maneira regular pode ser uma parte importante dos cuidados com a saúde. O programa reúne exercícios de força e mobilidade para fazer em casa.</p><div class="next-info-blue">Cada pessoa evolui no próprio ritmo. Não há promessa de alteração hormonal ou tratamento de saúde.</div>`,'',nextFooter('Continuar →',false,'data-next-result'),'next-story-page');
        } else if(nextResultStage==="confidence") {
          nextPage('Quão <em>confiante</em> você está para começar?',`<div class="next-options">${nextOption('confidence','muito','Muito, quero começar!','🚀')}${nextOption('confidence','tentar','Estou disposto a tentar algo novo!','✅')}${nextOption('confidence','duvida','Ainda tenho dúvidas, mas quero conhecer','💪')}</div>`,'Escolha a resposta que combina mais com você.');
        } else if(nextResultStage==="preview") {
          const currentW=Number(answers.currentWeight),targetW=Number(answers.targetWeight);
          const weightText=Number.isFinite(currentW)&&currentW>0?Math.round(currentW)+' kg':'Não informado';
          const targetText=Number.isFinite(targetW)&&targetW>0?Math.round(targetW)+' kg':'Não informado';
          nextPage('Seu plano de Calistenia Asiática está <em>quase pronto!</em>',`<div class="offer-plan-preview"><div class="offer-plan-images"><div><span>Seu ponto de partida</span>${photoNext('male-fitness.webp')}</div><div><span>Seu objetivo</span>${photoNext('male-hero.webp')}</div></div><div class="offer-plan-columns"><div><small>Peso atual</small><strong>${escapeHTML(weightText)}</strong><small>Rotina de exercícios</small><strong>${escapeHTML(answers.dailyActivity||'Informada no quiz')}</strong></div><div><small>Peso de referência</small><strong>${escapeHTML(targetText)}</strong><small>Foco do programa</small><strong>Força e mobilidade</strong></div></div></div><div class="next-info-blue">As imagens são ilustrativas. A aparência física e os resultados não podem ser previstos pelo quiz.</div>`,'',nextFooter('CONTINUAR',false,'data-next-result'),'next-summary-stage');
        }
        break;}
    }
  }
  function render() {
    document.title='calisteniasiatica';
    if(current!==35 && offerUnlockTimer){clearTimeout(offerUnlockTimer);offerUnlockTimer=null;}
    if(current===1){
      intro();
    } else if(current===35)offer(); else if(current<=20)renderFirstTwenty(); else renderNextScreens();
    window.scrollTo({top:0,behavior:'instant'});
  }
  function goTo(next,replace=false) {
    const previousStep=current;
    current=Math.min(35,Math.max(1,next));
    if(current===1 && previousStep!==1)showQuizLead=false;
    if(current!==34){resultProfileShown=false;nextResultStage='summary';}
    if(current===35 && previousStep!==35){try{sessionStorage.removeItem(OFFER_START_KEY);}catch(_){}}
    const url=current===1?'/pagina/':'/pagina/step-'+current;
    const params=location.search;
    if(replace)history.replaceState({step:current},'',url+params); else history.pushState({step:current},'',url+params);
    render();
  }
  root.addEventListener('click',event=>{
    const button=event.target.closest('button');
    if(!button)return;
    if(button.hasAttribute('data-begin-quiz')){showQuizLead=false;intro();return;}
    if(button.hasAttribute('data-unit')){
      const key=button.getAttribute('data-for'),u=button.getAttribute('data-unit');
      answers[key+'_unit']=u;remember();renderSlider();return;
    }
    if(button.hasAttribute('data-save-age')){
      const el=root.querySelector('[data-age-number]');const age=Number(el?.value);
      if(!Number.isInteger(age)||age<18||age>100){root.querySelector('.validation').textContent='Digite uma idade válida entre 18 e 100 anos.';return;}
      answers.exactAge=age;remember();return goTo(20);
    }
    if(button.hasAttribute('data-show-profile')){resultProfileShown=true;nextResultStage='profile';renderNextScreens();window.scrollTo(0,0);return;}
    if(button.hasAttribute('data-next-result')&&nextResultStage==='preview'){return goTo(35);}
    if(button.hasAttribute('data-next-result')){const order=['summary','profile','wellness','confidence','preview'];const idx=order.indexOf(nextResultStage);nextResultStage=order[Math.min(idx+1,order.length-1)];renderNextScreens();window.scrollTo(0,0);return;}
    if(button.hasAttribute('data-display-unit')){const key=button.getAttribute('data-for');answers[key+'_displayUnit']=button.getAttribute('data-display-unit');remember();renderNextScreens();return;}
    if(button.hasAttribute('data-next-measure')){const key=button.getAttribute('data-next-measure');if(!Number.isFinite(Number(answers[key]))){answers[key]=key==='height'?180:70;remember();}return goTo(current+1);}
    if(button.hasAttribute('data-back')){if(current===34&&nextResultStage!=='summary'){const order=['summary','profile','wellness','confidence','preview'];nextResultStage=order[Math.max(0,order.indexOf(nextResultStage)-1)];resultProfileShown=nextResultStage!=='summary';renderNextScreens();return;}return goTo(current-1);}
    if(button.hasAttribute('data-age')){answers={ageRange:button.getAttribute('data-age')};remember();return goTo(2);}
    if(button.hasAttribute('data-next')){
      if(current>=16&&current<=18){const key=current===16?'height':current===17?'currentWeight':'targetWeight'; if(answers[key]===undefined)answers[key]=current===16?165:current===17?73:57;remember();}
      return goTo(current+1);
    }
    if(button.hasAttribute('data-single')){
      answers[button.getAttribute('data-single')]=button.getAttribute('data-value');remember();if(current===34&&nextResultStage==='confidence'){nextResultStage='preview';renderNextScreens();window.scrollTo(0,0);return;}return goTo(current+1);
    }
    if(button.hasAttribute('data-multi')){
      const key=button.getAttribute('data-multi'),value=button.getAttribute('data-value');
      let values=Array.isArray(answers[key])?answers[key].slice():[];
      if(values.includes(value))values=values.filter(item=>item!==value);
      else { if((current===13&&value==='5')||value==='sem'||value==='nada') values=[]; else values=values.filter(item=>current===13?item!=='5':(item!=='sem'&&item!=='nada')); values.push(value); }
      if(current<=20 && (key==='discomforts'||key==='painAreas')) { if(value==='nenhum'){values=values.includes('nenhum')?['nenhum']:[];} else {values=values.filter(v=>v!=='nenhum');} } answers[key]=values;remember();if(current<=20)renderFirstTwenty();else renderQuestion(questions[current]);return;
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
  root.addEventListener('input',event=>{
    if(event.target.hasAttribute('data-next-range')){
      const el=event.target,key=el.getAttribute('data-next-range'),value=Number(el.value);
      const unit=answers[key+'_displayUnit']||(key==='height'?'cm':'kg');
      answers[key]=unit==='pol'?value*2.54:unit==='lb'?value/2.2046226:value;
      const out=root.querySelector('[data-measure-output]');if(out)out.textContent=Math.round(value);
      remember();return;
    }
    if(event.target.hasAttribute('data-ruler')){
      const el=event.target,key=el.getAttribute('data-ruler'),unit=answers[key+'_unit']||(key==='height'?'cm':'kg');
      const n=Number(el.value);answers[key]=key==='height'?(unit==='pol'?n*2.54:n):(unit==='Libra'?n/2.2046226:n);
      const read=root.querySelector('[data-value-readout]');if(read)read.textContent=Math.round(n);remember();
    }
    if(event.target.hasAttribute('data-age-number')){
      const age=Number(event.target.value);const btn=root.querySelector('[data-save-age]');if(btn)btn.disabled=!Number.isInteger(age)||age<18||age>100;
    }
  });
  root.addEventListener('change',event=>{
    if(event.target.hasAttribute('data-all-zone')){
      answers.bodyZones=event.target.checked?['0']:[];remember();renderReference();
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
