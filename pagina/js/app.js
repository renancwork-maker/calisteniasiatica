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
    24:opt('mealPreferences','Quais são suas preferências de refeição?','Pode marcar mais de um.',[['vegetariana','Eu sou vegetariana'],['vegana','Eu sou vegana'],['gluten','Não contém glúten'],['lactose','Sem lactose'],['semrestricoes','Sem restrições']],true),
    25:opt('habits','Quais desses hábitos você tem?','Selecione todos os que se aplicam.',[['procrastinacao','Procrastinação'],['alimentacao','Alimentação pouco saudável'],['midias','Mídias sociais'],['cafeina','Beber muita cafeína'],['series','Maratona de séries']],true),
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
  // Recriação mobile-first das telas fornecidas pelo proprietário em sequência.
  const A='/pagina/images/';
  const picture=(file,cls='',attrs='')=>`<img class="${cls}" src="${A}${file}" loading="lazy" decoding="async" alt="" ${attrs}>`;
  const reference={
    3:{key:'calistheniaExperience',type:'single',title:'Você já experimentou exercícios de calistenia?',items:['Sim','Não']},
    5:{key:'mainGoal',type:'single',title:'Qual é seu <em>principal objetivo</em>?',items:['Perder peso','Desenvolver músculos','Manter o peso e ficar em forma','Melhorar a aptidão física'],symbols:['⚖','♧','♙','ϟ']},
    6:{key:'additionalGoals',type:'multi',title:'O que mais você espera alcançar com este plano?',subtitle:'Pode escolher várias opções',items:['Aumentar a energia','Melhorar o sono','Reduzir o estresse','Melhorar a postura e a mobilidade','Desenvolver flexibilidade'],symbols:['▣','☾','♧','✣','✧']},
    7:{key:'bodyZones',type:'multi',title:'Quais são as zonas que mais a preocupam?',subtitle:'Por favor, selecione todas as opções aplicáveis',items:['Melhorar o corpo inteiro','Queixo duplo','Braços flácidos','Seios caídos','Gordura nos joelhos','Traseiro de alforje','Nádegas flácidas','Parte interna da coxa']},
    8:{key:'targetZones',type:'multi',title:'Quais são as suas zonas alvo?',subtitle:'Escolha todas as opções aplicáveis',items:['Barriga','Bunda','Pernas','Peito','Braços','Costas']},
    10:{key:'bodyType',type:'single',title:'Como você descreveria o seu corpo atualmente?',items:['Magra','Falsa Magra','Acima do peso','Sobrepeso']},
    11:{key:'dreamBody',type:'single',title:'Qual é o corpo dos seus sonhos?',items:['Curvado','Magro','Em forma','Tonificado','Estou bem com meu corpo']},
    12:{key:'fitnessHistory',type:'single',title:'Há quanto tempo você estava na melhor forma da sua vida?',items:['1 a 2 anos atrás','3 a 5 anos atrás','Mais de 5 anos atrás','Nunca']},
    13:{key:'limitations',type:'multi',title:'Você tem dificuldades com algum dos seguintes itens?',subtitle:'Por favor, selecione todas as opções aplicáveis',items:['Costas sensíveis','Joelhos sensíveis','Quadril sensível','Ombros e braços','Panturrilhas e tornozelos','Nenhuma das opções acima']},
    14:{key:'comfortLevel',type:'single',title:'Você se sente confortável ao se exercitar?',items:['Sinto dor/Desconforto','Sinto alguma dificuldade','Sinto-me confortável'],symbols:['😣','😳','😊']}
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
      const step7Thumbs=[null,'preocupacao-1.webp','preocupacao-2.webp','preocupacao-3.webp','preocupacao-5.webp','preocupacao-6.webp','preocupacao-7.webp','preocupacao-8.webp'];
      const thumb=current===7&&i>0?picture(step7Thumbs[i],'choice-thumb'):
       current===8?picture('zona-'+(i+1)+'.webp','choice-thumb'):
       current===11?picture('corpo-sonho-'+(i+1)+'.webp','choice-thumb'):
       current===13&&i<5?picture('dor-'+(i+1)+'.webp','choice-thumb'):'';
      const mark=multi?`<span class="option-check" aria-hidden="true">${on?'✓':''}</span>`:(current===3?'':`<span class="option-arrow" aria-hidden="true">${current===14?'':'›'}</span>`);
      if(current===7&&i===0)return '';
      return `<button type="button" class="choice ref-choice ${on?'selected':''} ${current===7&&i===0?'plain-choice':''}" data-${multi?'multi':'single'}="${key}" data-value="${i}" aria-pressed="${on?'true':'false'}">${thumb||icon}<span class="choice-label">${label}</span>${mark}</button>`;
    }).join('');
  }
  function renderReference(){
    if(current===2){
      mainStage(`${picture('grupo-mulheres.webp','group-image','width="348" height="260" fetchpriority="high"')}<div class="group-message"><h1>Elas conseguiram e você também pode</h1><p>Milhares de mulheres já começaram a se movimentar com a Calistenia Asiática.</p></div>`,'group-stage',continueButton('Continuar'));
      return;
    }
    if(current===4){
      illustrationStep('exercicio-sofa.webp','Você já tem a base, mas a Calistenia Asiática é diferente da calistenia comum.','Enquanto o método tradicional foca apenas em força externa, nossa técnica combina movimentos controlados e progressivos, respeitando sua capacidade física.','landscape-info','CONTINUAR');return;
    }
    if(current===9){
      illustrationStep('mulher-7-minutos.webp','Apenas 7 minutos por dia — uma forma simples de incluir movimento na sua rotina!','O programa apresenta exercícios de calistenia adaptáveis para fazer em casa, com orientação para respeitar seu ritmo e ganhar constância.','short-info','Continuar');return;
    }
    if(current===15){
      illustrationStep('mulher-positivo.webp','Nós cuidamos de você!','Adaptamos seu programa com alternativas para promover movimentos seguros e suaves. Caso sinta dor, respeite seus limites e procure orientação profissional.','short-info','Continuar');return;
    }
    if(current>=16&&current<=18){return renderSlider();}
    if(current===19){
      const value=answers.exactAge??'';
      mainStage(`<div class="content-wrap input-age"><h1>Qual é a sua idade?</h1><input type="number" min="18" max="100" name="age" data-age-number inputmode="numeric" placeholder="Digite sua idade" value="${escapeHTML(value)}" aria-label="Digite sua idade"><div class="soft-note"><b>ⓘ &nbsp; Perguntamos sua idade para personalizar seu plano</b><small>O nível de atividade e suas condições individuais importam mais do que apenas a sua idade.</small></div><p class="validation" aria-live="polite"></p><button type="button" class="primary" data-save-age ${!value?'disabled':''}>Próximo passo</button></div>`,'age-stage');return;
    }
    const q=reference[current];if(!q)return;
    const choices=optionsFor(q);
    if(current===3){
      mainStage(`<div class="photo-form"><h1>${q.title}</h1><div class="photo-form-choices">${choices}</div>${picture('mulher-quiz.webp','quiz-woman','width="203" height="449"')}</div>`,'photo-stage');return;
    }
    if(current===10){
      const cards=q.items.map((title,i)=>{const sel=answers[q.key]===String(i);return `<button class="body-card ${sel?'selected':''}" data-single="${q.key}" data-value="${i}">${picture('corpo-atual-'+(i+1)+'.webp','body-card-img','width="148" height="140"')}<span>${title}</span></button>`;}).join('');
      mainStage(`<div class="content-wrap grid-content"><h1>${q.title}</h1><div class="body-grid">${cards}</div></div>`,'body-stage');return;
    }
    if(current===12){
      mainStage(`<div class="photo-form best-form-layout"><h1>${q.title}</h1><div class="photo-form-choices best-form-choices">${choices}</div>${picture('melhor-fase.webp','quiz-woman best-form-image','width="320" height="478"')}</div>`,'photo-stage best-form-stage');return;
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
  function intro() {
    root.innerHTML=`<div class="page slide-in" data-boot-intro><header class="hdr"><span class="hdr-logo">CALISTENIA</span><span class="hdr-badge">by Atlas</span></header><main class="main"><div class="title"><h1>Programa de Calistenia Asiática <span class="hl">para Mulheres</span></h1><p class="badge">TESTE DE 1 MINUTO</p><p class="question-age">Quantos anos você tem?</p></div><div class="btns">${['39 – 45','46 – 50','51 – 60','60+'].map(a=>`<button type="button" class="btn" data-age="${a}"><span>${a}</span><span class="arrow">➜</span></button>`).join('')}</div><img class="hero-img" src="/pagina/images/asian-woman-fitness.webp" srcset="/pagina/images/asian-woman-fitness-520.webp 520w,/pagina/images/asian-woman-fitness.webp 760w" sizes="(max-width: 768px) 230px,440px" alt="Mulher asiática praticando calistenia" width="650" height="1000" decoding="async" fetchpriority="high"><footer class="ftr">Ao escolher sua idade, concorda com nossos <a href="#">Termos de Serviço</a> e reconhece nossa <a href="#">Política de Privacidade</a> e <a href="#">Política de Cookies</a></footer></main></div>`;
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
      wrap(`<main class="stage media-stage water-stage"><h1>Como está seu consumo de água?</h1><p class="desc">Pequenos hábitos também podem ajudar seu bem-estar.</p><div class="media-split"><div class="media-options">${values}</div><img class="media-figure water-figure" src="/pagina/images/water-quiz.webp" alt="" width="1000" height="710" loading="lazy" decoding="async"></div></main>`);
      return;
    }
    if(current===23){
      const opts=[['menos6','Menos de 6 horas'],['6a7','Entre 6 e 7 horas'],['7a9','Entre 7 e 9 horas'],['mais9','Mais de 9 horas']];
      const values=opts.map(([value,label])=>`<button type="button" class="sleep-card ${answers.sleepDuration===value?'selected':''}" data-single="sleepDuration" data-value="${value}" aria-pressed="${answers.sleepDuration===value?'true':'false'}"><span>${label}</span></button>`).join('');
      wrap(`<main class="stage sleep-stage"><h1>Quantas horas você costuma dormir?</h1><img class="sleep-image" src="/pagina/images/sleep-quiz.webp" alt="" width="671" height="1000" loading="lazy" decoding="async"><div class="sleep-grid">${values}</div></main>`);
      return;
    }
    if(current===24){
      const items=[
        ['vegetariana','meal-vegetarian.webp','Eu sou vegetariana','Verduras, grãos, mas sem carne animal'],
        ['vegana','meal-vegan.webp','Eu sou vegana','Puramente à base de plantas, sem produtos de origem animal'],
        ['gluten','meal-glutenfree.webp','Não contém glúten','Excluir produtos de grãos que contenham glúten'],
        ['lactose','meal-lactosefree.webp','Sem lactose','Excluir produtos lácteos'],
        ['semrestricoes','meal-norestrictions.webp','Sem restrições','Aberto a todos os alimentos']
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
    const href=escapeHTML(checkoutHref());
    wrap(`<main class="stage"><h1>Seu Programa de <span class="hl">Calistenia Asiática em Casa</span> está pronto</h1><p class="desc">Conheça o programa e veja como começar com exercícios progressivos sem sair de casa.</p><div class="video-wrap"><vturb-smartplayer id="vid-6af495416685e101a472e87e" style="display:block;margin:0 auto;width:100%;max-width:400px"><div class="vturb-player-placeholder" style="position:relative;width:100%;padding:178.21782178217822% 0 0;z-index:0;background-color:black"></div></vturb-smartplayer></div><div class="offer-price"><small>Pagamento único</small><div>R$ 37,90</div></div><p class="offer-price-caption">Acesso ao programa de 21 dias</p><a class="checkout" href="${href}" data-checkout rel="noopener noreferrer">QUERO COMEÇAR AGORA ›</a><p class="trust">🔒 Checkout seguro na Wiapy • Compra pela plataforma de pagamento</p><section class="panel"><h2>O que está incluído</h2><ul class="list-check"><li>Programa de calistenia para treinar em casa</li><li>Sequência progressiva para 21 dias</li><li>Orientações para iniciar no seu ritmo</li><li>Exercícios com foco em força e mobilidade</li></ul></section><a class="checkout" href="${href}" data-checkout rel="noopener noreferrer">GARANTIR MEU ACESSO — R$ 37,90 ›</a><p class="tiny">Resultados individuais variam. Respeite seus limites físicos e consulte um profissional de saúde se necessário.</p></main>`,'offer');
    attachVTurb();
  }
  function render() {
    document.title=current===35?'Calistenia Asiática em Casa — Acesso | Atlas':'Calistenia Asiática em Casa — 21 Dias | Atlas';
    if(current===1){if(!root.querySelector('[data-boot-intro]'))intro();} else if(current===35)offer(); else if(current<=19)renderReference(); else renderQuestion(questions[current]);
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
    if(button.hasAttribute('data-unit')){
      const key=button.getAttribute('data-for'),u=button.getAttribute('data-unit');
      answers[key+'_unit']=u;remember();renderSlider();return;
    }
    if(button.hasAttribute('data-save-age')){
      const el=root.querySelector('[data-age-number]');const age=Number(el?.value);
      if(!Number.isInteger(age)||age<18||age>100){root.querySelector('.validation').textContent='Digite uma idade válida entre 18 e 100 anos.';return;}
      answers.exactAge=age;remember();return goTo(20);
    }
    if(button.hasAttribute('data-back'))return goTo(current-1);
    if(button.hasAttribute('data-age')){answers={ageRange:button.getAttribute('data-age')};remember();return goTo(2);}
    if(button.hasAttribute('data-next')){
      if(current>=16&&current<=18){const key=current===16?'height':current===17?'currentWeight':'targetWeight'; if(answers[key]===undefined)answers[key]=current===16?165:current===17?73:57;remember();}
      return goTo(current+1);
    }
    if(button.hasAttribute('data-single')){
      answers[button.getAttribute('data-single')]=button.getAttribute('data-value');remember();return goTo(current+1);
    }
    if(button.hasAttribute('data-multi')){
      const key=button.getAttribute('data-multi'),value=button.getAttribute('data-value');
      let values=Array.isArray(answers[key])?answers[key].slice():[];
      if(values.includes(value))values=values.filter(item=>item!==value);
      else { if((current===13&&value==='5')||value==='sem'||value==='nada') values=[]; else values=values.filter(item=>current===13?item!=='5':(item!=='sem'&&item!=='nada')); values.push(value); }
      answers[key]=values;remember();if(current<=19)renderReference();else renderQuestion(questions[current]);return;
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
