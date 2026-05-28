# ArtMaker

Aplicação web em arquivo único para geração de encartes promocionais para varejo. Desenvolvida com HTML5, CSS3 e JavaScript puro — sem frameworks, sem etapa de build, sem backend, sem dependências além de uma chamada de fonte via CDN.

O arquivo gerado é um PNG de 1080×1920 px (proporção 9:16), pronto para Instagram Stories, Facebook Stories e Status do WhatsApp.

---

## Como usar

Baixe o `index.html` e abra em qualquer navegador moderno. Só isso.

Para inserir a logo da loja, converta sua imagem PNG para Base64 em qualquer conversor online gratuito, abra o `index.html` em um editor de texto e cole a string em:

```js
const LOGO_BASE64 = ""; // cole aqui
```

---

## Funcionalidades

### Conteúdo
- Data de validade das ofertas (padrão: amanhã)
- Endereço da loja e texto do cabeçalho editáveis
- De 1 a 6 produtos por encarte
- Nome, preço, foto e opção de moldura por produto
- Botão de remoção individual de foto

### Design — controle visual completo
- 8 paletas de cores prontas: Preto & Ouro, Dourado Clássico, Vermelho Mercado, Verde Orgânico, Azul Premium, Roxo Elegante, Laranja Vibrante, Dark Mode
- Seletor de cor individual para cada elemento: fundo do cabeçalho, texto do cabeçalho, fundo dos cards, borda dos cards, nome do produto, preço, fundo do encarte, fundo do rodapé, texto do rodapé
- Cada seção de cor combina 8 swatches predefinidos com entrada de cor livre

### Layout
- 4 estilos de card: borda fina, sombra, fundo colorido, gradiente
- 4 estilos de cabeçalho: clássico, dividido, banner, minimalista
- 4 estilos de rodapé: sólido, escuro, minimalista, ondulado
- 4 estilos de preço: texto livre, etiqueta, círculo, faixa
- 4 opções de cantos: quadrado, leve, médio, arredondado
- 4 opções de espessura de borda: sem borda, fina, média, grossa

### Grades dinâmicas
| Produtos | Layout |
|---|---|
| 1 | Card único centralizado em destaque |
| 2 | Lado a lado |
| 3 | Disposição em T (um produto no topo em largura total, dois abaixo) |
| 4 | Grade 2×2 |
| 5 | Grade 3+2 |
| 6 | Grade 2×3 |

### Usabilidade
- Todas as alterações renderizam em tempo real com debounce
- Indicador de status: Editando... / Pronto
- Botão de download com estados de feedback: Gerando... e Salvo!
- Responsivo: no desktop exibe painel e preview lado a lado; no celular exibe o formulário em tela cheia com botão flutuante para abrir o preview em modal

---

## Notas Técnicas

- Motor de renderização: HTML5 Canvas API em 1080×1920 px, escalado via CSS `aspect-ratio`
- Sem dependências externas em tempo de execução; fontes Poppins e JetBrains Mono via CDN
- `ctx.roundRect()` com fallback manual para browsers mais antigos
- Renderização aguarda `document.fonts.ready`
- `font-size: 16px` em todos os inputs previne zoom automático no iOS Safari
- `100dvh` utilizado para corrigir o bug da barra de ferramentas do Safari no iOS
- Sombras do canvas resetadas com `ctx.restore()` para evitar vazamento entre elementos
- Prevenção de XSS: todas as strings do usuário são escapadas antes de entrar no `innerHTML`
- Validação do campo de preço com regex `/^[\d.,]*$/` e exibição de erro inline

---

## Estrutura do Projeto

```
index.html        — a aplicação completa (HTML + CSS + JS em arquivo único)
README.md         — documentação em inglês (principal)
README.pt-BR.md   — este arquivo
```

---

## Desenvolvido por

**AFN Systems** — by Alyssom Fernandes

---

## Licença

MIT
