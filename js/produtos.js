const DATA_PATH = 'data/produtos.json';
let produtos = [];

async function fetchProdutos(){
  try{
    const resp = await fetch(DATA_PATH);
    produtos = await resp.json();
    renderProdutos(produtos);
  }catch(err){
    console.error('Erro ao carregar produtos:', err);
  }
}

function renderProdutos(list){
  const container = document.getElementById('produtos-container');
  container.innerHTML = '';
  list.forEach(prod => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${prod.imagem}" alt="${prod.nome}">
      <h3>${prod.nome}</h3>
      <p>${prod.descricao}</p>
      <div class="price-row">
        <div class="price">${formatPrice(prod.preco)}</div>
        <div class="actions">
          <button class="ghost" onclick="openDetails(${prod.id})">Detalhes</button>
          <button onclick="quickAdd(${prod.id})">Adicionar</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function quickAdd(id){
  const prod = produtos.find(p => p.id === id);
  if(!prod) return;
  const cart = loadCart();
  const found = cart.find(i => i.id === prod.id);
  if(found){ found.quantidade += 1; } else cart.push({...prod, quantidade:1});
  saveCart(cart);
  showToast('✅ Produto adicionado ao carrinho');
}

function openDetails(id){
  const prod = produtos.find(p => p.id === id);
  if(!prod) return;

  const modal = document.getElementById('detalhes');
  const conteudo = document.getElementById('conteudo');
  const addBtn = document.getElementById('addToCartBtn');
  const title = document.getElementById('modalTitle');

  title.textContent = prod.nome;
  conteudo.innerHTML = `
    <img src="${prod.imagem}" alt="${prod.nome}">
    <div class="info">
      <h3>${prod.nome}</h3>
      <p>${prod.descricao}</p>
      <p><strong>Preço:</strong> ${formatPrice(prod.preco)}</p>
      <p><strong>Peso:</strong> ${prod.peso} kg</p>
      <p><strong>Frete estimado:</strong> ${formatPrice((prod.peso * 5).toFixed(2))}</p>
    </div>
  `;

  // ⚠️ garante que não acumula listeners
  const newBtn = addBtn.cloneNode(true);
  addBtn.parentNode.replaceChild(newBtn, addBtn);

  newBtn.addEventListener('click', ()=>{
    quickAdd(prod.id);
    modal.classList.add('oculto');
  });

  modal.classList.remove('oculto');
}

/* eventos modal e busca */
document.addEventListener('click', (e)=>{
  if(e.target && e.target.id === 'closeModal') document.getElementById('detalhes').classList.add('oculto');
});

document.addEventListener('DOMContentLoaded', ()=>{
  fetchProdutos();
  updateCartCountUI();

  const search = document.getElementById('searchInput');
  if(search){
    search.addEventListener('input', (evt)=>{
      const q = evt.target.value.toLowerCase().trim();
      const filtered = produtos.filter(p => p.nome.toLowerCase().includes(q));
      renderProdutos(filtered);
    });
  }
});
