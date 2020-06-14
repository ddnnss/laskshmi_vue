Vue.component('header-cart-items', {
    delimiters: ['[[', ']]'],
    props: ['item','index'],
    template:`    <div class="header-cart-inner-item">
                            <img :src="[[item.image]]" :alt="[[item.name]]">
                            <div class="header-cart-inner-item-info">
                                <p class="header-cart-inner-item-info-name">[[item.name]]</p>
                                <div class="header-cart-inner-item-info-price">
                                    <p class="header-cart-inner-item-info-price-p1">Цена: <span>[[item.price]] руб.</span></p>
                                    <p class="header-cart-inner-item-info-price-p2">Итого: <span>[[item.num * item.price]] руб.</span></p>
                                </div>
                            </div>
                            <div class="header-cart-inner-item-delete">
                                <span v-on:click="userDelete(index)">&#10006;</span>
                            </div>
                        </div>`,
    methods: {
        userDelete: function(index){
            this.$emit('userdelete', index);
        }
    }
})


Vue.component('main-cart-item', {
    delimiters: ['[[', ']]'],
    props: ['item','index'],
    template:` <div class="cart-items__item block-w-r4 cart-grid">
                        <div class="cart-items__item-name">
                            <img :src="[[item.image]]" alt="">
                            <div class="cart-items__item-name-wrapper">
                                <p class="text-bold mb-10">[[item.name]]</p>
                                <span>Амулеты Фэн-Шуй</span>
                            </div>
                        </div>
                        <div style="flex-basis: 125px;
    display: flex;
    align-items: center;
    justify-content: space-between;" class="cart-items__item-qt">
                             <p v-on:click="delQt(index)">-</p><input class="form-control" id="quantity" readonly type="number" :value="[[item.num]]" min="1"><p v-on:click="addQt(index)">+</p>
                        </div>
                        <div class="cart-items__item-price text-bold">[[item.price]]Р</div>
                        <div class="cart-items__item-total text-bold">[[item.num * item.price]]Р</div>
                        <div class="cart-items__item-action  text-bold"><span v-on:click="userDelete(index)">&#215;</span></div>

                    </div>`,
    methods: {
        userDelete: function (index) {
            this.$emit('userdelete', index);
        },
        delQt: function (index) {

            this.$emit('del_qt', index);
        },
        addQt: function (index) {
            this.$emit('add_qt', index);
        }
    }
})

var app = new Vue({
    delimiters: ['[[', ']]'],
    el: '#app',
    data: {
        cartTotal:0,
        cartTotalWithDiscount:0,
        cartItemsNum:0,
        promoDiscount:0,
        promo_code:'',
        headerCartOpen:false,
        cartNotEmpty : false,
        loginModal:false,
        menuOpen:false,
        registerModal:false,
        mobileSubMenu: false,
        searchBox: false,
        headerCartItems: [
        ]
    },

    methods:{
        openMenu:function(){
          if (this.menuOpen){
              this.menuOpen = false
          }else {
              this.menuOpen = true
          }

        },
         openMobileSubMenu:function(){
          if (this.mobileSubMenu){
              this.mobileSubMenu = false
          }else {
              this.mobileSubMenu = true
          }

        },
        openModal: function(id){
          this.loginModal = false
          this.registerModal = false
            if(id==='reg'){
              this.registerModal = true
            }
            if(id==='log'){
              this.loginModal = true
            }
        },
        headerCartMouseLeave: function(){
            this.headerCartOpen=false
        },
        remove: function(index){
            let item_id =this.headerCartItems[index]['id']
            this.headerCartItems.splice(index, 1)
            this.sendUpdateRequest(item_id,'del_item')
            Toastify({
                duration: 1000,
                close: true,
                text: `Товар удален из корзины`,
                backgroundColor: "linear-gradient(to right, #f55f63, #be353b)",
                className: "info",
            }).showToast();
        },
        openHeaderCart:function () {
            if (this.headerCartOpen){
                this.headerCartOpen=false
            }else{
                this.headerCartOpen=true
            }
        }
        ,
        del_qt: function (index) {
            if (this.headerCartItems[index]['num'] > 1){
                this.headerCartItems[index]['num'] -= 1
                this.updateCart(this.headerCartItems[index]['id'],this.headerCartItems[index]['num'])
            }
        },
        add_qt: function (index) {
            this.headerCartItems[index]['num'] += 1
            this.updateCart(this.headerCartItems[index]['id'],this.headerCartItems[index]['num'])
        },
        updateCart: function (item_id,num) {
            console.log('update',item_id,num)
            this.cartTotal = 0
            for(var item in this.headerCartItems){
                console.log(this.headerCartItems[item]['price'])
                this.cartTotal +=  parseInt(this.headerCartItems[item]['price']) * parseInt(this.headerCartItems[item]['num'])
            }
            if (this.promoDiscount > 0){
                this.cartTotalWithDiscount = parseInt(this.cartTotal - (this.cartTotal * this.promoDiscount / 100))
            }

            this.sendUpdateRequest(item_id,'set_num',num)
        },
        sendUpdateRequest: function(item_id,action,num='1'){
            let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value,
                overlay = document.getElementById('cart_overlay'),
                body = {item_id:item_id,
                    action:action,
                    number:num}
            if (overlay){overlay.classList.add('cart-overlay-active')}
            console.log(body)
            fetch(`/cart/add_to_cart/`, {
                method: 'post',
                body: JSON.stringify(body),
                headers: { "X-CSRFToken": csrfmiddlewaretoken },
                credentials: 'same-origin'
            }).then(res=>res.json())
                .then(res => {
                    if (res['result'] === true){
                        console.log(res)
                    }
                    if (overlay){overlay.classList.remove('cart-overlay-active')}

                })
        },
        addItem: function (event) {
            let item_id = event.target.getAttribute('data-id'),
                item_name = event.target.getAttribute('data-name'),
                item_price = event.target.getAttribute('data-price'),
                item_image = event.target.getAttribute('data-image'),
                item_num = event.target.getAttribute('data-num'),
                id_in_array = false,
                index = 0

            console.log('add')

            let values = Object.entries(this.headerCartItems )
            console.log('en',values)
            for (x of values){
                console.log('xx',x[1]['id'])
                if (parseInt(item_id) === parseInt(x[1]['id'])){
                    id_in_array = true
                    index=x[0]
                }
            }

            if (id_in_array){
                console.log('in array')
                this.headerCartItems[parseInt(index)]['num'] = parseInt(item_num)
                console.log(this.headerCartItems)
                this.updateCart(this.headerCartItems[parseInt(index)]['id'],this.headerCartItems[parseInt(index)]['num'])
            }
            else {
                this.headerCartItems.push({id:item_id,name:item_name,num:item_num,price:item_price,image:item_image })
                this.sendUpdateRequest(item_id,'add_new',item_num)
            }
            Toastify({
                duration: 1000,
                close: true,
                text: `${item_name} ${item_num}шт. добавлено в корзину`,
                backgroundColor: "linear-gradient(to right, #f55f63, #be353b)",
                className: "info",
            }).showToast();
        },
        addInFav:function (event) {
            console.log('addinfav')
            let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value,
                body = {item_id:event.target.getAttribute('data-id')},
                text=''


            console.log(body)
            fetch(`/cart/add_to_fav/`, {
                method: 'post',
                body: JSON.stringify(body),
                headers: { "X-CSRFToken": csrfmiddlewaretoken },
                credentials: 'same-origin'
            }).then(res=>res.json())
                .then(res => {

                      console.log(res)
                       event.target.classList.toggle('item-in-fav')
                    if (res['result']==='deleted'){text='Товар удален из избранного'}
                    if (res['result']==='added'){text='Товар добавлен в избранное'}

                    Toastify({
                        duration: 1000,
                        close: true,
                        text: text,
                        backgroundColor: "linear-gradient(to right, #f55f63, #be353b)",
                        className: "info",
                    }).showToast();
                })
        },
        changeImg:function (event) {
            let large_img = event.target.dataset.large,
                small_img = event.target.dataset.small,
                zoom_large = document.getElementById('zoom_img_large'),
                zoom_small = document.getElementById('zoom_img_small')

            zoom_large.style.backgroundImage = `url(${large_img})`
            zoom_small.setAttribute('src',small_img)


        },
        usePromo:function (event) {
            if(this.promo_code===''){return}
             console.log('promo',this.promo_code)
              let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value,
                body = {promo_code:this.promo_code}


            console.log(body)
            fetch(`/cart/use_promo/`, {
                method: 'post',
                body: JSON.stringify(body),
                headers: { "X-CSRFToken": csrfmiddlewaretoken },
                credentials: 'same-origin'
            }).then(res=>res.json())
                .then(res => {

                      console.log(res)


                    Toastify({
                        duration: 1000,
                        close: true,
                        text: res['result'],
                        backgroundColor: "linear-gradient(to right, #f55f63, #be353b)",
                        className: "info",
                    }).showToast();
                })

        }
    },
    watch: {
        promoDiscount:function(val){
          console.log('apply discount')
            this.cartTotalWithDiscount = parseInt(this.cartTotal - (this.cartTotal * this.promoDiscount / 100))
        },
        headerCartItems: function (val) {
            console.log('change')
            this.cartTotal = 0
            let x = 0,
                cart_items_count = document.getElementById('cart_items_count')

            for(var item in val){
                console.log(val[item]['price'])
                this.cartTotal +=  parseInt(val[item]['price']) * parseInt(val[item]['num'])
                x+=1
            }
            if (this.promoDiscount > 0){
                this.cartTotalWithDiscount = parseInt(this.cartTotal - (this.cartTotal * this.promoDiscount / 100))
            }
            console.log('items count=', x)
            this.cartItemsNum = x

        }
    }
})