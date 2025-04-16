
function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const tbody = document.getElementById('carrinhoTabela');
    let valorTotal = 0;

    tbody.innerHTML = '';

    carrinho.forEach((item, index) => {
        const totalProduto = item.preco * item.quantidade;
        valorTotal += totalProduto;

        tbody.innerHTML += `
            <tr>
                <td><img src="${item.imagem}" alt="${item.nome}" width="50"></td>
                <td>${item.nome}</td>
                <td>R$ ${item.preco.toFixed(2)}</td>
                <td><input type="number" value="${item.quantidade}" min="0" onchange="atualizarQuantidade(${index})"></td>
                <td>R$ ${totalProduto.toFixed(2)}</td>
                <td><button onclick="removerProduto(${index})">Remover</button></td>
            </tr>
        `;
    });

    document.getElementById('valorTotal').innerText = valorTotal.toFixed(2);
}


function atualizarQuantidade(index) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho'));
    const quantidade = document.querySelectorAll('input[type="number"]')[index].value;

    if (quantidade == 0) {
        removerProduto(index);
    } else {
        carrinho[index].quantidade = parseInt(quantidade);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinho();
    }
}


function removerProduto(index) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho'));
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
}


function enviarPedido() {
    localStorage.removeItem('carrinho');
    alert("Pedido enviado com sucesso!");
    window.location.href = 'index.html';
}


window.onload = carregarCarrinho;