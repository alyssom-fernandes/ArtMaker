# Changelog

Registro das mudanças do ArtMaker, por versão. O formato segue o
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). As datas são as dos
commits e das tags do repositório.

## [Não lançado]

### Adicionado
- Contador de letras ("58/60") no campo de nome do produto, que aparece nos
  últimos 10 caracteres do limite, para o corte do campo não parecer defeito.
  O encarte gerado não muda.
- Testes da validação de projetos e dados salvos (tipos errados, textos
  longos, cores inválidas, campos faltando, `__proto__`): de 19 para 33 testes.
- Este CHANGELOG e o `.mailmap`, que reúne as duas identidades de autor do
  histórico em "Alyssom Fernandes".

### Alterado
- `aplicarDados` e `migrarDados` passaram a ter a validação em
  `normalizarDados`, dentro do bloco de funções sem DOM que os testes
  carregam. O comportamento é o mesmo.
- README (inglês e português): a frase sobre o tamanho de nomes e preços diz
  também que um nome muito longo pode sair um pouco menor.

## [2.1.0] - 2026-10-15

### Adicionado
- Prévia do encarte ao passar o mouse numa paleta da aba Cores, com a
  legenda avisando que é só uma prévia; o clique aplica.
- No desktop, o celular e as ações formam um bloco só, no meio do palco, com o
  nome do arquivo embaixo dos botões.
- Demo no celular abre na folha "Seu encarte", com "Editar o exemplo" ao lado
  de Baixar.
- Content-Security-Policy por meta com o hash de cada script, `no-referrer`, e
  `tests/csp.test.mjs`, que falha se um script mudar sem a política acompanhar.
- README com a demo e os encartes na capa, a autorização da dona do Mercado
  Vitória para o uso da marca e a origem das fontes.

### Corrigido
- Barra do celular: "6 produtos · até 16/10" voltou a ter o espaço antes do ponto.
- Faixa do modo demonstração marcada antes da primeira pintura: o editor não
  pula mais ao abrir.
- Entre 1100 e 1200 px de largura numa tela alta, a imagem do encarte não achata mais.
- Preço antigo riscado com contraste mínimo de 4,5:1.
- Na aba Estilo, com o quadro Sombra, as espessuras da borda saem de vista e
  fica a explicação, em vez de quatro opções apagadas.

## [2.0.0] - 2026-10-01

### Adicionado
- Encarte no formato do Status: fundo em degradê da paleta, título num adesivo,
  preço em Anton, destaque com 3 e 4 produtos e rodapé em bloco.
- Editor refeito, com tema claro e escuro, prévia dentro da moldura do Status e
  miniaturas desenhadas pelo próprio motor do encarte.
- Celular como app: abas presas com Desfazer e Refazer, folhas que fecham
  arrastando, Enter leva ao próximo campo e barra com a miniatura viva.
- Salvamento automático (localStorage e IndexedDB) e duas abas sem conflito.
- Projeto em arquivo, compartilhar, imprimir em A4 e Tirar fundo.
- Prévia de link, página 404, README em português e em inglês e testes
  rodando no GitHub Actions.

## [1.0.0] - 2026-05-28

Primeira versão, no commit "ArtMaker v1.0" (sem tag no repositório).

### Adicionado
- Gerador de encarte de ofertas em um único `index.html`, com README em
  português e em inglês e licença MIT.

[Não lançado]: https://github.com/alyssom-fernandes/ArtMaker/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/alyssom-fernandes/ArtMaker/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/alyssom-fernandes/ArtMaker/compare/c6209ca...v2.0.0
