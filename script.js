




const WHATSAPP = "555193725707";

const TAXA_ENTREGA = 5.00;




let carrinho = [];


// Recupera o carrinho salvo
try {

    const carrinhoSalvo =
        localStorage.getItem("brasaBurgerCarrinho");

    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
    }

} catch (erro) {

    console.error(
        "Não foi possível carregar o carrinho:",
        erro
    );

    carrinho = [];

}




function salvarCarrinho() {

    localStorage.setItem(
        "brasaBurgerCarrinho",
        JSON.stringify(carrinho)
    );

}




function formatarPreco(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function adicionarCarrinho(nome, preco) {

    const produtoExistente =
        carrinho.find(
            produto => produto.nome === nome
        );


    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        carrinho.push({

            nome: nome,

            preco: preco,

            quantidade: 1

        });

    }


    salvarCarrinho();

    atualizarCarrinho();

    mostrarNotificacao(
        `${nome} foi adicionado ao carrinho.`
    );

}




function removerProduto(index) {

    if (
        index < 0 ||
        index >= carrinho.length
    ) {
        return;
    }


    carrinho.splice(index, 1);

    salvarCarrinho();

    atualizarCarrinho();

}



function aumentarQuantidade(index) {

    if (!carrinho[index]) {
        return;
    }


    carrinho[index].quantidade++;

    salvarCarrinho();

    atualizarCarrinho();

}




function diminuirQuantidade(index) {

    if (!carrinho[index]) {
        return;
    }


    carrinho[index].quantidade--;


    if (carrinho[index].quantidade <= 0) {

        carrinho.splice(index, 1);

    }


    salvarCarrinho();

    atualizarCarrinho();

}


function atualizarCarrinho() {

    const cartItems =
        document.getElementById("cart-items");

    const cartCount =
        document.getElementById("cart-count");

    const subtotalElement =
        document.getElementById("cart-subtotal");

    const deliveryElement =
        document.getElementById("delivery-fee");

    const totalElement =
        document.getElementById("cart-total");


    if (!cartItems) {
        return;
    }


   
    const quantidadeTotal =
        carrinho.reduce(
            (total, produto) =>
                total + produto.quantidade,
            0
        );


    if (cartCount) {

        cartCount.textContent =
            quantidadeTotal;

    }



    if (carrinho.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <span>🛒</span>

                <h3>
                    Seu carrinho está vazio
                </h3>

                <p>
                    Adicione produtos para começar.
                </p>

            </div>

        `;

    } else {

        cartItems.innerHTML =
            carrinho.map(
                (produto, index) => `

                <div class="cart-item">

                    <div class="cart-item-info">

                        <h3>
                            ${produto.nome}
                        </h3>

                        <div class="cart-item-price">
                            ${formatarPreco(produto.preco)}
                        </div>

                        <div class="cart-item-controls">

                            <button
                                class="quantity-button"
                                onclick="diminuirQuantidade(${index})"
                            >
                                −
                            </button>

                            <span class="quantity">
                                ${produto.quantidade}
                            </span>

                            <button
                                class="quantity-button"
                                onclick="aumentarQuantidade(${index})"
                            >
                                +
                            </button>

                            <button
                                class="remove-button"
                                onclick="removerProduto(${index})"
                            >
                                remover
                            </button>

                        </div>

                    </div>

                    <div class="cart-item-total">

                        ${formatarPreco(
                            produto.preco *
                            produto.quantidade
                        )}

                    </div>

                </div>

            `
            ).join("");

    }


    

    const subtotal =
        carrinho.reduce(
            (total, produto) =>
                total +
                produto.preco *
                produto.quantidade,
            0
        );


   

    const tipoPedido =
        document.querySelector(
            'input[name="order-type"]:checked'
        );


    const entregaSelecionada =
        !tipoPedido ||
        tipoPedido.value === "entrega";


    const taxa =
        carrinho.length > 0 &&
        entregaSelecionada
            ? TAXA_ENTREGA
            : 0;


    const total =
        subtotal + taxa;


    if (subtotalElement) {

        subtotalElement.textContent =
            formatarPreco(subtotal);

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            taxa === 0
                ? "Grátis"
                : formatarPreco(taxa);

    }


    if (totalElement) {

        totalElement.textContent =
            formatarPreco(total);

    }

}




function abrirCarrinho() {

    const cart =
        document.getElementById("cart");

    const overlay =
        document.getElementById("cart-overlay");


    if (cart) {
        cart.classList.add("active");
    }

    if (overlay) {
        overlay.classList.add("active");
    }


    document.body.classList.add("cart-open");

}




function fecharCarrinho() {

    const cart =
        document.getElementById("cart");

    const overlay =
        document.getElementById("cart-overlay");


    if (cart) {
        cart.classList.remove("active");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }


    document.body.classList.remove("cart-open");

}




function limparCarrinho() {

    if (carrinho.length === 0) {
        return;
    }


    const confirmar =
        confirm(
            "Tem certeza que deseja limpar o carrinho?"
        );


    if (!confirmar) {
        return;
    }


    carrinho = [];

    salvarCarrinho();

    atualizarCarrinho();

    mostrarNotificacao(
        "Carrinho limpo."
    );

}




let notificationTimeout;


function mostrarNotificacao(mensagem) {

    const notification =
        document.getElementById(
            "notification"
        );

    const notificationText =
        document.getElementById(
            "notification-text"
        );


    if (!notification) {
        return;
    }


    if (notificationText) {

        notificationText.textContent =
            mensagem;

    }


    notification.classList.add(
        "active"
    );


    clearTimeout(
        notificationTimeout
    );


    notificationTimeout =
        setTimeout(
            () => {

                notification.classList.remove(
                    "active"
                );

            },
            3000
        );

}




function filtrarCategoria(
    categoria,
    botao
) {

    const produtos =
        document.querySelectorAll(
            ".product"
        );


    const botoes =
        document.querySelectorAll(
            ".category-button"
        );


    botoes.forEach(
        item => {
            item.classList.remove(
                "active"
            );
        }
    );


    if (botao) {

        botao.classList.add(
            "active"
        );

    }


    produtos.forEach(
        produto => {

            const categoriaProduto =
                produto.dataset.category;


            if (
                categoria === "todos" ||
                categoria === categoriaProduto
            ) {

                produto.style.display =
                    "";

                setTimeout(
                    () => {
                        produto.style.opacity =
                            "1";
                    },
                    10
                );

            } else {

                produto.style.display =
                    "none";

            }

        }
    );

}



function alterarTipoPedido() {

    const tipoPedido =
        document.querySelector(
            'input[name="order-type"]:checked'
        );


    const endereco =
        document.getElementById(
            "customer-address"
        );


    if (!tipoPedido || !endereco) {
        return;
    }


    if (
        tipoPedido.value ===
        "retirada"
    ) {

        endereco.value = "";

        endereco.placeholder =
            "Retirada no balcão";

        endereco.disabled =
            true;

    } else {

        endereco.placeholder =
            "Endereço de entrega";

        endereco.disabled =
            false;

    }


    atualizarCarrinho();

}




function validarPedido() {

    if (carrinho.length === 0) {

        mostrarNotificacao(
            "Adicione algum produto ao carrinho."
        );

        abrirCarrinho();

        return false;

    }


    const nome =
        document
            .getElementById(
                "customer-name"
            )
            .value
            .trim();


    if (!nome) {

        mostrarNotificacao(
            "Digite seu nome."
        );

        document
            .getElementById(
                "customer-name"
            )
            .focus();

        return false;

    }


    const tipoPedido =
        document.querySelector(
            'input[name="order-type"]:checked'
        );


    if (
        tipoPedido &&
        tipoPedido.value ===
        "entrega"
    ) {

        const endereco =
            document
                .getElementById(
                    "customer-address"
                )
                .value
                .trim();


        if (!endereco) {

            mostrarNotificacao(
                "Digite seu endereço."
            );

            document
                .getElementById(
                    "customer-address"
                )
                .focus();

            return false;

        }

    }


    const pagamento =
        document
            .getElementById(
                "payment-method"
            )
            .value;


    if (!pagamento) {

        mostrarNotificacao(
            "Escolha uma forma de pagamento."
        );

        document
            .getElementById(
                "payment-method"
            )
            .focus();

        return false;

    }


    return true;

}



function finalizarPedido() {

    if (!validarPedido()) {
        return;
    }


    const nome =
        document
            .getElementById(
                "customer-name"
            )
            .value
            .trim();


    const tipoPedido =
        document.querySelector(
            'input[name="order-type"]:checked'
        );


    const tipo =
        tipoPedido
            ? tipoPedido.value
            : "entrega";


    const endereco =
        document
            .getElementById(
                "customer-address"
            )
            .value
            .trim();


    const observacoes =
        document
            .getElementById(
                "order-notes"
            )
            .value
            .trim();


    const pagamento =
        document
            .getElementById(
                "payment-method"
            )
            .value;


    const troco =
        document
            .getElementById(
                "change-for"
            )
            .value
            .trim();


   

    let mensagem =
        "🔥 *NOVO PEDIDO - BRASA BURGER*%0A%0A";


    mensagem +=
        `👤 *Cliente:* ${nome}%0A`;


    mensagem +=
        `📦 *Pedido:* ${
            tipo === "entrega"
                ? "Entrega"
                : "Retirada"
        }%0A%0A`;


    mensagem +=
        "🍔 *ITENS DO PEDIDO:*%0A";


    carrinho.forEach(
        produto => {

            const subtotalProduto =
                produto.preco *
                produto.quantidade;


            mensagem +=
                `• ${produto.quantidade}x ${
                    produto.nome
                } - ${
                    formatarPreco(
                        subtotalProduto
                    )
                }%0A`;

        }
    );




    const subtotal =
        carrinho.reduce(
            (total, produto) =>
                total +
                produto.preco *
                produto.quantidade,
            0
        );


    const taxa =
        tipo === "entrega"
            ? TAXA_ENTREGA
            : 0;


    const total =
        subtotal + taxa;


    mensagem +=
        `%0A💰 *Subtotal:* ${
            formatarPreco(subtotal)
        }%0A`;


    mensagem +=
        `🛵 *Entrega:* ${
            taxa === 0
                ? "Grátis"
                : formatarPreco(taxa)
        }%0A`;


    mensagem +=
        `💵 *TOTAL:* ${
            formatarPreco(total)
        }%0A%0A`;


   

    if (tipo === "entrega") {

        mensagem +=
            `📍 *Endereço:* ${endereco}%0A`;

    }


    

    mensagem +=
        `💳 *Pagamento:* ${pagamento}%0A`;


    if (
        pagamento === "Dinheiro" &&
        troco
    ) {

        mensagem +=
            `💵 *Troco para:* R$ ${troco}%0A`;

    }


   

    if (observacoes) {

        mensagem +=
            `%0A📝 *Observações:* ${observacoes}%0A`;

    }


    mensagem +=
        "%0AObrigado! 🔥";


   

    const url =
        `https://wa.me/${WHATSAPP}?text=${mensagem}`;


    window.open(
        url,
        "_blank"
    );

}




document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            fecharCarrinho();

        }

    }
);



document.addEventListener(
    "DOMContentLoaded",
    () => {

        atualizarCarrinho();

        alterarTipoPedido();

    }
);