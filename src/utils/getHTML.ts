import { LexicalNode } from "../classes/LexicalNode/LexicalNode";
import { NodeKey } from "../classes/LexicalNode/types";

export const getHTML = (stateMap: Map<NodeKey, LexicalNode>) => {
    // Создаем временный контейнер
  const container = document.createElement('div');
  container.setAttribute('id', 'root')
  container.setAttribute('style', 'display="block;"')

  // Рекурсивная функция для построения HTML
  function buildNode(nodeKey: NodeKey) {
    const node = stateMap.get(nodeKey);
    if (!node) return '';

    let html = '';
    let tag = '';
    let attrs = '';

const key = node.getKey();
    // Определяем тег и атрибуты
    switch (node._type) {

    case 'div':
        tag = 'div';
        break
      case 'p':
        tag = 'p';
        break;
      case 'h':
        tag = `h${node.getRange() || 1}`;
        break;
      case 'span':
        tag = 'span';
        // Применяем стили как атрибуты
        if (node.getStyle()) {
          const style = [];
          if (node.getStyle().fontStyle === 'italic') style.push('font-style:italic');
          if (node.getStyle().fontWeight === '700') style.push('font-weight:bold');
          if (node.getStyle().textDecoration === 'underline') style.push('text-decoration:underline');
          if (node.getStyle().fontFamily) style.push(`font-family:${node.getStyle().fontFamily}`);
          if (node.getStyle().color) style.push(`color:${node.getStyle().color}`);
          if (node.getStyle().backgroundColor) style.push(`color:${node.getStyle().backgroundColor}`);
          if (style.length) attrs = ` style="${style.join(';')}"`;
        }
        break;
      case 'list':
        tag = node.getType() === 'ol' ? 'ol' : 'ul';
        break;
      case 'li':
        tag = 'li';
        break;
        case 'img':
        tag='img';
        attrs = ` width=${node.getWidth()} height=${node.getHeight()} alt=${node.getAlt()} src=${node.getSrc()}`
        break
        case 'a':
            tag='a'
            attrs=` hreaf=${node.getHref()}`
        break
      default:
        tag = 'div';
    }
    console.log(key)
attrs += ` id=${key}`
    // Открывающий тег
    html += `<${tag}${attrs}>`;

    // Текст для span
    if (node._type === 'span' && node.getText()) {
      html += node.getText();
    }

    // Дочерние элементы
    if (node.getType() !== 'img' && node.getChildren()) {
      for (const childKey of node.getChildren()) {
        html += buildNode(childKey);
      }
    }

    // Закрывающий тег
    html += `</${tag}>`;

    return html;
  }

  // Строим HTML начиная с корня
  const root = stateMap.get('root');
  if (root && root.getChildren()) {
    for (const childKey of root.getChildren()) {
      container.innerHTML += buildNode(childKey);
    }
  }

  return container.innerHTML;
}
