/* utils.js
 - funções utilitárias: formatar preço, storage e toast
*/
const STORAGE_KEYS = {
  CARRINHO: 'carrinho',
  PEDIDOS: 'pedidos'
};

function formatPrice(v){
  return v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}

function saveCart(cart){
  localStorage.setItem(STORAGE_KEYS.CARRINHO, JSON.stringify(cart));
  updateCartCountUI();
}

function loadCart(){
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CARRINHO) || '[]');
}

function savePedido(pedido){
  const pedidos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PEDIDOS) || '[]');
  pedidos.push(pedido);
  localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
}

function showToast(message, duration=2000){
  const toast = document.getElementById('toast');
  if(!toast) return;
  toast.textContent = message;
  toast.classList.remove('oculto');
  setTimeout(()=> toast.classList.add('oculto'), duration);
}

function updateCartCountUI(){
  const count = loadCart().reduce((s,i)=> s + (i.quantidade||0), 0);
  const el = document.getElementById('cartCount');
  const elTop = document.getElementById('cartCountTop');
  if(el) el.textContent = count;
  if(elTop) elTop.textContent = count;
}
