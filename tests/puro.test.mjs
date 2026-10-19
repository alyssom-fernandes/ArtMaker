/* Testes das funções puras do ArtMaker.

   O app é um arquivo só; este teste lê o index.html, recorta o bloco entre
   "══ PURO" e "══ FIM PURO ══" e roda num contexto isolado. Sem dependências:
     node --test                                                            */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const html = readFileSync(fileURLToPath(new URL('../index.html', import.meta.url)), 'utf8');
const inicio = html.indexOf('/* ══ PURO'), fim = html.indexOf('/* ══ FIM PURO ══ */');
assert.ok(inicio > 0 && fim > inicio, 'bloco PURO não encontrado no index.html');
const ctx = vm.createContext({});
vm.runInContext(html.slice(inicio, fim), ctx);
const f = nome => ctx[nome] ?? vm.runInContext(nome, ctx);

test('lerPreco entende os jeitos comuns de digitar', () => {
  const lerPreco = f('lerPreco');
  assert.equal(lerPreco(''), null);
  assert.equal(lerPreco('   '), null);
  assert.deepEqual({ ...lerPreco('19') }, { ok: true, reais: 19, centavos: '00', valor: 19 });
  assert.deepEqual({ ...lerPreco('19,9') }, { ok: true, reais: 19, centavos: '90', valor: 19.9 });
  assert.equal(lerPreco('1.299,90').reais, 1299);
  assert.equal(lerPreco('1299,90').valor, 1299.9);
  assert.equal(lerPreco('R$ 5,99').valor, 5.99);
  assert.equal(lerPreco('19.90').centavos, '90', 'ponto com 2 casas é decimal');
  assert.equal(lerPreco('19,').centavos, '00', 'vírgula no fim, enquanto digita');
});

test('lerPreco recusa o que não é preço', () => {
  const lerPreco = f('lerPreco');
  for (const ruim of ['abc', '1,2,3', ',,,', '12..3', '1.23.4,5', '19,999', '29,90/kg'])
    assert.equal(lerPreco(ruim).ok, false, ruim);
});

test('formatarPreco devolve o formato brasileiro', () => {
  const lerPreco = f('lerPreco'), formatarPreco = f('formatarPreco');
  assert.equal(formatarPreco(lerPreco('1299.5')), '1.299,50');
  assert.equal(formatarPreco(lerPreco('7')), '7,00');
  assert.equal(formatarPreco(lerPreco('')), '');
});

test('descontoPct arredonda para baixo e ignora o que não é desconto', () => {
  const d = f('descontoPct');
  assert.equal(d('28,90', '24,90'), 13);
  assert.equal(d('10,00', '5,00'), 50);
  assert.equal(d('5,00', '5,00'), 0);
  assert.equal(d('4,00', '5,00'), 0);
  assert.equal(d('', '5,00'), 0);
  assert.equal(d('abc', '5,00'), 0);
  // em ponto flutuante estes davam 1 ponto a menos
  assert.equal(d('10,00', '7,90'), 21);
  assert.equal(d('100,00', '79,00'), 21);
  assert.equal(d('5,00', '3,95'), 21);
  assert.equal(d('20,00', '15,80'), 21);
  // varredura: nunca passa do valor exato
  for (let c = 1; c < 1000; c += 7) {
    const exato = (1000 - c) / 1000 * 100;
    assert.equal(d('10,00', (c / 100).toFixed(2).replace('.', ',')), Math.floor(exato + 1e-9));
  }
});

test('lerPreco recusa preço acima do máximo e aceita o "R" sozinho como vazio', () => {
  const lerPreco = f('lerPreco');
  assert.equal(lerPreco('100.000,00').ok, false);
  assert.equal(lerPreco('100.000,00').motivo, 'alto');
  assert.equal(lerPreco('99.999,99').ok, true);
  assert.equal(lerPreco('R'), null);
  assert.equal(lerPreco('R$ '), null);
});

test('isoValido recusa datas que não existem e anos de dois dígitos', () => {
  const v = f('isoValido');
  assert.equal(v('2026-10-01'), true);
  assert.equal(v('2028-02-29'), true);
  for (const ruim of ['2026-02-31', '2026-13-01', '2099-99-99', '0002-02-02', '1999-12-31', 'lixo', ''])
    assert.equal(v(ruim), false, ruim);
});

test('frasePendencias concorda em número e junta com "e"', () => {
  const fp = f('frasePendencias');
  assert.equal(fp(0, 0, 0), '');
  assert.equal(fp(1, 0, 0), '1 produto sem foto');
  assert.equal(fp(2, 1, 0), '2 produtos sem foto e 1 sem nome');
  assert.equal(fp(4, 4, 4), '4 produtos sem foto, 4 sem nome e 4 sem preço');
  assert.equal(fp(0, 0, 3), '3 produtos sem preço');
});

test('diaDaSemana em português', () => {
  assert.equal(f('diaDaSemana')('2026-10-03'), 'sábado');
  assert.equal(f('diaDaSemana')('2026-10-01'), 'quinta-feira');
  assert.equal(f('diaDaSemana')('lixo'), '');
});

test('contraste segue a fórmula WCAG', () => {
  const c = f('contraste');
  assert.equal(Math.round(c('#000000', '#ffffff') * 100) / 100, 21);
  assert.equal(c('#777777', '#777777'), 1);
  assert.ok(Math.abs(c('#c5a059', '#ffffff') - 2.46) < 0.01);
});

test('ajustarCor mantém a cor quando já dá para ler e escurece quando não dá', () => {
  const a = f('ajustarCor'), c = f('contraste');
  assert.equal(a('#111111', '#ffffff', 4.5), '#111111');
  const ouro = a('#c5a059', '#ffffff', 3);
  assert.notEqual(ouro, '#c5a059');
  assert.ok(c(ouro, '#ffffff') >= 3);
  const clara = a('#333333', '#000000', 4.5);
  assert.ok(c(clara, '#000000') >= 4.5);
});

test('corSobre escolhe branco ou quase preto sobre o preenchimento', () => {
  const s = f('corSobre');
  assert.equal(s('#8b0000'), '#ffffff');
  assert.equal(s('#dddddd'), '#151515');
});

test('misturar e hexParaRgb', () => {
  assert.equal(f('misturar')('#000000', '#ffffff', 0.5), '#808080');
  assert.deepEqual({ ...f('hexParaRgb')('#c5a059') }, { r: 197, g: 160, b: 89 });
  assert.deepEqual({ ...f('hexParaRgb')('#fff') }, { r: 255, g: 255, b: 255 });
});

test('datas locais e texto de validade', () => {
  const iso = f('dataParaIso'), deIso = f('isoParaData'), prox = f('proximoDia'), tv = f('textoValidade');
  assert.equal(iso(new Date(2026, 8, 30, 23, 30)), '2026-09-30', 'sem virar o dia depois das 21h');
  assert.equal(iso(deIso('2026-02-28')), '2026-02-28');
  assert.equal(iso(prox(new Date(2026, 8, 30), 6)), '2026-10-03', 'próximo sábado a partir de uma quarta');
  assert.equal(iso(prox(new Date(2026, 9, 3), 6)), '2026-10-10', 'num sábado, o próximo sábado');
  assert.equal(tv('2026-10-01'), 'Ofertas válidas até: 01/10/2026');
  assert.equal(tv('lixo'), '');
});

test('slug e nome do arquivo', () => {
  assert.equal(f('slug')('Mercado Vitória'), 'mercado-vitoria');
  assert.equal(f('slug')('  Pão & Cia!  '), 'pao-cia');
  assert.equal(f('slug')(''), 'loja');
  assert.equal(f('nomeArquivo')('Mercado Vitória', new Date(2026, 9, 1)), 'encarte-mercado-vitoria-2026-10-01.png');
});

test('id da foto: único, reconhecido e com a hora de criação', () => {
  const novoIdFoto = f('novoIdFoto'), ID_FOTO = f('ID_FOTO');
  const antes = Date.now(), ids = Array.from({ length: 50 }, novoIdFoto);
  assert.equal(new Set(ids).size, 50, 'sem repetição');
  for (const id of ids) {
    const m = ID_FOTO.exec(id);
    assert.ok(m, id);
    assert.ok(Math.abs(parseInt(m[1], 36) - antes) < 5000, 'a hora sai do próprio id');
  }
  for (const ruim of ['p0', 'logo', 'f-abc', 'f--x', 'f-ABC-def', 'f-abc-def-ghi', 'f-abc-<img>'])
    assert.equal(ID_FOTO.test(ruim), false, ruim);
});

test('migrarDados traduz os nomes antigos de estilo e de cor', () => {
  const migrarDados = f('migrarDados');
  const m = migrarDados({ cartao: 'shadow', preco: 'ribbon', cabecalho: 'split', rodape: 'dark', fonte: 'moderna', C: { hbg: '#111111', pbg: '#ffffff' } });
  assert.deepEqual([m.cartao, m.preco, m.cabecalho, m.rodape, m.fonte], ['sombra', 'faixa', 'faixa', 'escuro', 'moderna']);
  assert.deepEqual({ ...m.C }, { cabecalhoFundo: '#111111', encarteFundo: '#ffffff' });
  assert.equal(migrarDados({ cartao: 'contorno' }).cartao, 'contorno', 'nome novo fica como está');
  assert.equal(migrarDados(null), null);
});

test('esc neutraliza HTML', () => {
  assert.equal(f('esc')('<img src=x onerror="a">'), '&lt;img src=x onerror=&quot;a&quot;&gt;');
});

/* normalizarDados: a validação de tudo o que vem de fora (localStorage,
   projeto aberto de arquivo). Entradas hostis não podem quebrar nem passar. */
const normalizar = d => JSON.parse(JSON.stringify(f('normalizarDados')(d)));
const padrao = () => JSON.parse(JSON.stringify(f('estadoPadrao')()));

test('normalizarDados: o que não é objeto vira o encarte padrão', () => {
  for (const ruim of [null, undefined, 0, 7, 'texto', true]) {
    const e = normalizar(ruim);
    assert.equal(e.loja, padrao().loja, String(ruim));
    assert.equal(e.qtd, 4);
    assert.equal(e.prods.length, 6);
  }
});

test('normalizarDados: campos faltando ficam com o padrão', () => {
  const e = normalizar({}), p = padrao();
  assert.deepEqual(e, p);
  assert.equal(normalizar({ loja: 'Mercado X' }).titulo, p.titulo);
});

test('normalizarDados: tipos errados são ignorados', () => {
  const e = normalizar({
    loja: 123, endereco: { a: 1 }, titulo: ['x'], obs: null, validade: 20260101, qtd: '3',
    cartao: 42, preco: {}, logo: 'outra', C: 'vermelho', prods: 'nada'
  }), p = padrao();
  assert.equal(e.loja, p.loja);
  assert.equal(e.endereco, p.endereco);
  assert.equal(e.titulo, p.titulo);
  assert.equal(e.obs, p.obs);
  assert.equal(e.qtd, p.qtd);
  assert.equal(e.cartao, p.cartao);
  assert.equal(e.preco, p.preco);
  assert.equal(e.logo, p.logo);
  assert.deepEqual(e.C, p.C);
  assert.equal(e.prods.length, 6);
  assert.ok(f('isoValido')(e.validade), 'validade sempre válida');
});

test('normalizarDados: textos longos são cortados no limite do campo', () => {
  const longo = 'x'.repeat(5000), L = f('LIMITES');
  const e = normalizar({ loja: longo, endereco: longo, titulo: longo, obs: longo,
    prods: [{ nome: longo, preco: longo, de: longo, arquivo: longo }] });
  assert.equal(e.loja.length, L.loja);
  assert.equal(e.endereco.length, L.endereco);
  assert.equal(e.titulo.length, L.titulo);
  assert.equal(e.obs.length, L.obs);
  assert.equal(e.prods[0].nome.length, L.nome);
  assert.equal(e.prods[0].preco.length, L.preco);
  assert.equal(e.prods[0].de.length, L.preco);
  assert.equal(e.prods[0].arquivo.length, L.arquivo);
});

test('normalizarDados: qtd só aceita inteiros de 1 a 6', () => {
  for (const ruim of [0, 7, -1, 2.5, NaN, Infinity, '4', null]) assert.equal(normalizar({ qtd: ruim }).qtd, 4, String(ruim));
  for (const bom of [1, 3, 6]) assert.equal(normalizar({ qtd: bom }).qtd, bom);
});

test('normalizarDados: só cores #rrggbb valem e as chaves desconhecidas somem', () => {
  const p = padrao();
  const e = normalizar({ C: {
    cabecalhoFundo: '#ABCDEF', cabecalhoTexto: 'red', cardFundo: '#fff', cardBorda: 'url(javascript:alert(1))',
    nomeTexto: '#12345g', precoTexto: 123, encarteFundo: '#1234567', rodapeFundo: null, rodapeTexto: '#000000', invasora: '#ffffff'
  } });
  assert.equal(e.C.cabecalhoFundo, '#abcdef', 'minúsculas');
  assert.equal(e.C.rodapeTexto, '#000000');
  for (const k of ['cabecalhoTexto', 'cardFundo', 'cardBorda', 'nomeTexto', 'precoTexto', 'encarteFundo', 'rodapeFundo'])
    assert.equal(e.C[k], p.C[k], k);
  assert.equal('invasora' in e.C, false);
});

test('normalizarDados: estilos e logo só com valores conhecidos', () => {
  const e = normalizar({ fonte: 'comic', cartao: 'contorno', borda: 6, raio: 13, preco: 'circulo', cabecalho: '<b>', rodape: 'onda', logo: 'nenhuma' });
  const p = padrao();
  assert.equal(e.fonte, p.fonte);
  assert.equal(e.cartao, 'contorno');
  assert.equal(e.borda, 6);
  assert.equal(e.raio, p.raio, '13 não é um raio da lista');
  assert.equal(e.preco, 'circulo');
  assert.equal(e.cabecalho, p.cabecalho);
  assert.equal(e.rodape, 'onda');
  assert.equal(e.logo, 'nenhuma');
  assert.equal(normalizar({ borda: '6' }).borda, p.borda, 'número em texto não vale');
});

test('normalizarDados: validade inválida vira amanhã', () => {
  const amanha = f('amanhaIso')();
  assert.equal(normalizar({ validade: '2026-02-31' }).validade, amanha);
  assert.equal(normalizar({ validade: '0002-01-01' }).validade, amanha);
  assert.equal(normalizar({ validade: '<img>' }).validade, amanha);
  assert.equal(normalizar({ validade: '2030-05-17' }).validade, '2030-05-17');
});

test('normalizarDados: produtos hostis não quebram e ficam dentro das regras', () => {
  const e = normalizar({ prods: [
    null, 'texto', 5, [], { nome: 9, preco: {}, unidade: 'tonelada', selo: 'GRÁTIS', foto: '../../etc', moldura: 'sim', claro: 0 },
    { unidade: 'kg', selo: 'desconto', foto: 'f-abc123-xyz789', transparente: 1 },
    { nome: 'ok' }, { nome: 'sétimo, ignorado' }
  ] });
  assert.equal(e.prods.length, 6, 'sempre 6 produtos');
  const vazio = padrao().prods[0];
  assert.deepEqual(e.prods[0], vazio);
  assert.deepEqual(e.prods[1], vazio);
  assert.equal(e.prods[4].nome, '');
  assert.equal(e.prods[4].unidade, '');
  assert.equal(e.prods[4].selo, '');
  assert.equal(e.prods[4].foto, '', 'id de foto fora do formato é descartado');
  assert.equal(e.prods[4].moldura, true, 'valor verdadeiro vira booleano');
  assert.equal(e.prods[4].claro, false);
  assert.equal(e.prods[5].unidade, 'kg');
  assert.equal(e.prods[5].selo, 'desconto');
  assert.equal(e.prods[5].foto, 'f-abc123-xyz789');
  assert.equal(e.prods[5].transparente, true);
  assert.equal(e.prods.some(p => p.nome === 'sétimo, ignorado'), false);
});

test('normalizarDados: não altera o objeto recebido e devolve cópias independentes', () => {
  const entrada = { loja: 'A', C: { cardFundo: '#ffffff' }, prods: [{ nome: 'x' }] };
  const copia = JSON.stringify(entrada);
  const e1 = f('normalizarDados')(entrada), e2 = f('normalizarDados')(entrada);
  assert.equal(JSON.stringify(entrada), copia);
  e1.C.cardFundo = '#000000'; e1.prods[0].nome = 'mudou';
  assert.equal(e2.C.cardFundo, '#ffffff');
  assert.equal(e2.prods[0].nome, 'x');
  assert.equal(f('estadoPadrao')().prods[0].nome, '');
});

test('normalizarDados: __proto__ no JSON não contamina nada', () => {
  const hostil = JSON.parse('{"__proto__":{"polui":1},"C":{"__proto__":{"polui":1}},"prods":[{"__proto__":{"polui":1}}]}');
  const e = f('normalizarDados')(hostil);
  assert.equal(e.polui, undefined);
  assert.equal(vm.runInContext('({}).polui', ctx), undefined);
});

test('migrarDados traduz nomes antigos em inglês e mantém o resto', () => {
  const m = f('migrarDados');
  const n = m({ cartao: 'border', preco: 'tag', cabecalho: 'banner', rodape: 'wave', C: { hbg: '#111111', ptxt: '#222222', cardFundo: '#ffffff' } });
  assert.equal(n.cartao, 'contorno');
  assert.equal(n.preco, 'etiqueta');
  assert.equal(n.cabecalho, 'diagonal');
  assert.equal(n.rodape, 'onda');
  assert.deepEqual({ ...n.C }, { cabecalhoFundo: '#111111', precoTexto: '#222222', cardFundo: '#ffffff' });
  assert.equal(m(null), null);
  assert.equal(m('x'), 'x');
  assert.equal(m({ cartao: 'sombra' }).cartao, 'sombra');
});

test('projeto antigo (nomes em inglês) abre traduzido por normalizarDados', () => {
  const e = normalizar({ cartao: 'filled', preco: 'circle', C: { hbg: '#0a0a0a' } });
  assert.equal(e.cartao, 'preenchido');
  assert.equal(e.preco, 'circulo');
  assert.equal(e.C.cabecalhoFundo, '#0a0a0a');
});
