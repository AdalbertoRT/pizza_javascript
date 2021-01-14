let modalQtd = 1;
let pizzaKey;
let itemsCart = [];
let preco = 0;
let cart = [];
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    //Preeencher os itens(pizzas) com as suas respectivas informações
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `<strong>R$</strong> ${item.price.toFixed(2).replace('.', ',')}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    //Preencher a .pizza-area com os itens(pizzas)
    c('.pizza-area').append(pizzaItem);

    //Modal
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        //Preencher o Modal com as informações relativas ao item selecionado
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        pizzaKey = key;
        modalQtd = 1;
        preco = pizzaJson[key].price * modalQtd;
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${preco.toFixed(2).replace('.', ',')}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach( (size, sizeIndex) => {
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
            size.addEventListener('click', () => {
                c('.pizzaInfo--size.selected').classList.remove('selected');
                size.classList.add('selected');
            })
        } );
        c('.pizzaInfo--qt').innerHTML = modalQtd;
        //Abrir o modal
        modal = c('.pizzaWindowArea');
        modal.style.opacity = 0;
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = 1;
        }, 200);
        
    })
});

//Ações do Modal
//Botões de tamanho/kg
cs('.pizzaInfo--size').forEach( (size, sizeIndex) => {
    size.addEventListener('click', () => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        preco = pizzaJson[pizzaKey].price;
        if(sizeIndex == 1){
            preco = preco - (preco * 0.2);
        }else if(sizeIndex == 0){
            preco = preco - (preco * 0.35);
        }
        c('.pizzaInfo--actualPrice').innerHTML = 'R$ '+ preco.toFixed(2).replace('.', ',');
    });
} );
//Aumentar/Diminuir quantidade
cs('.pizzaInfo--qtmenos, .pizzaInfo--qtmais').forEach( (itemQtd, indexQtd) => {
    itemQtd.addEventListener('click', () => {
        if(indexQtd == 0){
            if(modalQtd > 1){
                modalQtd--;
                if(preco >= pizzaJson[pizzaKey].price){
                    preco -= pizzaJson[pizzaKey].price;
                }
            }
        }else{
            modalQtd++;
            preco += pizzaJson[pizzaKey].price;
        }
        c('.pizzaInfo--qt').innerHTML = modalQtd;
        c('.pizzaInfo--actualPrice').innerHTML = 'R$ '+ preco.toFixed(2).replace('.', ',');
    })
} );
//Fechar o modal
let fecharModal = () => {
        modal.style.opacity = 0;
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
}
//Botão Cancelar/Voltar
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach( (item) => item.addEventListener('click', fecharModal) )

//Adicionar ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = 'p'+pizzaJson[pizzaKey].id+'s'+size;
    //Ver se ja existe o item
    let key = cart.findIndex( (item) => item.identifier == identifier );
    //Adicionar ao array cart
    if(key > -1){
        cart[key].qtd += modalQtd;
    }else{
        cart.push( {
            identifier,
            id:pizzaJson[pizzaKey].id,
            img:pizzaJson[pizzaKey].img,
            size,
            name:pizzaJson[pizzaKey].name,
            price:preco,
            qtd: modalQtd
        } );
    }
    
    //Mostrar o carrinho
    fecharModal();  
    showCarrinho();
})

//Abrir carrinho
function showCarrinho() {
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';
    }else{
        c('aside').classList.remove ('show');
        c('.cart').innerHTML = '';
    }
    //Itens no carrinho
    let itens = 0;
    let tam;
    //Subtotal e Total
    let subtotal = 0;
    let desconto = 0.1;
    let total = 0;

    cart.map( (item, index) => {
        itens += item.qtd;
        subtotal = item.price * item.qtd;
        switch(item.size){
            case 0: tam = 'P'; break;
            case 1: tam = 'M'; break;
            case 2: tam = 'G'; break;
        }
        let cartItems = c('.models .cart--item').cloneNode(true);
        cartItems.querySelector('img').src = item.img;
        cartItems.querySelector('.cart--item-nome').innerHTML = `${item.name} (${tam})`;
        cartItems.querySelector('.cart--item--qt').innerHTML = item.qtd;
        c('.cart').append(cartItems);
        cartItems.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
            if(cart[index].qtd > 1){
                cart[index].qtd--;
            }else{
                cart.splice(index, 1);
                c('aside').style.left = '100vw';
            }
            showCarrinho();
        });
        cartItems.querySelector('.cart--item-qtmais').addEventListener('click', () => {
            cart[index].qtd++;
            showCarrinho();
        });
        
    });
    c('.menu-openner span').innerHTML = itens;

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c('.subtotal').children[1].innerHTML = 'R$ '+subtotal.toFixed(2).replace('.', ',');
    c('.desconto').children[1].innerHTML = 'R$ '+desconto.toFixed(2).replace('.', ',');
    c('.total').children[1].innerHTML = 'R$ '+total.toFixed(2).replace('.', ',');
}

//Mobile
//Botao abrir carrinho
c('.menu-openner').addEventListener('click', ()=> {
    if(cart.length > 0){
        c('aside').style.left = 0;
        c('aside').classList.add('show');
    }
});
//Botão fechar carrinho
c('.menu-closer').addEventListener('click', ()=> {
        c('aside').style.left = '100vw';
        c('aside').classList.remove('show');
});
