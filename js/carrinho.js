// carrinho.js
document.addEventListener('DOMContentLoaded', () => {
  renderCarrinho();

  document.getElementById('limparCarrinho')?.addEventListener('click', () => {
    localStorage.removeItem('carrinho');
    renderCarrinho();
  });

  document.getElementById('finalizarPedido')?.addEventListener('click', () => {
    const cart = loadCart();
    if (cart.length === 0) {
      showToast('⚠️ Seu carrinho está vazio');
      return;
    }
    savePedido({ itens: cart, data: new Date() });
    localStorage.removeItem('carrinho');
    renderCarrinho();
    showToast('✅ Pedido finalizado!');
  });
});

function renderCarrinho() {
  const tbody = document.getElementById('carrinhoTabela');
  const subtotalEl = document.getElementById('subtotal');
  const freteEl = document.getElementById('frete');
  const totalEl = document.getElementById('valorTotal');

  const cart = loadCart();
  tbody.innerHTML = '';

  let subtotal = 0;
  let frete = 0;

  cart.forEach(item => {
    const linha = document.createElement('tr');
    const totalItem = item.preco * item.quantidade;
    subtotal += totalItem;
    frete += item.peso * 5 * item.quantidade; // regra do frete

    linha.innerHTML = `
      <td><img src="${item.imagem}" alt="${item.nome}"> ${item.nome}</td>
      <td>${formatPrice(item.preco)}</td>
      <td>
        <div class="quantity-controls">
          <button class="q-btn" onclick="alterarQtd(${item.id}, -1)">−</button>
          ${item.quantidade}
          <button class="q-btn" onclick="alterarQtd(${item.id}, 1)">+</button>
        </div>
      </td>
      <td>${formatPrice(totalItem)}</td>
      <td><button class="ghost" onclick="removerItem(${item.id})">Remover</button></td>
    `;
    tbody.appendChild(linha);
  });

  subtotalEl.textContent = formatPrice(subtotal);
  freteEl.textContent = formatPrice(frete);
  totalEl.textContent = formatPrice(subtotal + frete);

  updateCartCountUI();
}

function alterarQtd(id, delta) {
  const cart = loadCart();
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.quantidade += delta;
  if (item.quantidade <= 0) {
    const i = cart.indexOf(item);
    cart.splice(i, 1);
  }
  saveCart(cart);
  renderCarrinho();
}

function removerItem(id) {
  let cart = loadCart();
  cart = cart.filter(p => p.id !== id);
  saveCart(cart);
  renderCarrinho();
}
