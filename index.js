$(document).ready(function(){
    
    var draggableItems = $('.products');
    var cart = document.getElementById('cart');
    var shoppingCart = [];
    var counter = $('#count-of-items');
    var totalPrice = $('#total-price'); 
    var list = $('#list-of-items');
    var products = JSON.parse(localStorage.getItem('shoppingCart'));
    var productData = [];
    var productIds = {"product1-cart":{"name":"blue-grecian","price":8000},
        "product2-cart":{"name":"little-black-dress","price":2500},
        "product3-cart":{"name":"Oxblood Wrap Dress","price":5000},"product4-cart":{"name":"White Flair Dress","price":6000},
        "product5-cart":{"name":"Black Platform Heels","price":12000},"product6-cart":{"name":"White Shoe Boot","price":8000},
        "product7-cart":{"name":"Brown Vintage","price":5000},"product8-cart":{"name":"Brown Flats","price":10000},
        "product9-cart":{"name":"Multi-Colored Schoolbag","price":8000},"product10-cart":{"name":"Orange Multipurpose","price":8000},
        "product11-cart":{"name":"Peach Easybag","price":5000},"product12-cart":{"name":"Brown Leather Schoolbag","price":9000}};


    (function setProductsData(){
        var sum_counter = 0;
        var price_counter = 0;
        if(products.length){
            for(var i = 0; i < products.length; i++){
                sum_counter += products[i]["quantity"];
                price_counter += products[i]["price"];
            }

            var products_data = {"sum_counter": sum_counter, "price_counter": price_counter };
            productData.push(products_data);

            localStorage.setItem("productData", JSON.stringify(productData));
         }
    })();

    (function updateProductsData(){
        var parsedProductData = JSON.parse(localStorage.getItem('productData'));

        if(parsedProductData){
            for(var i = 0; i < parsedProductData.length; i++){
                counter.html(parsedProductData[i]["sum_counter"]);
                totalPrice.html(parsedProductData[i]["price_counter"]);
            }
        }
    })();

    displayCartItems();
    
    function displayCartItems(){
        var products = JSON.parse(localStorage.getItem('shoppingCart'));
        if(products) {
            var items ="Item" + "&emsp;&emsp;&emsp;&emsp;" + "Price of item" 
            + "&emsp;&emsp;&emsp;&emsp;" + "Quantity of item" + "<br>";
            for (var i = 0; i < products.length; i++){
                if(products[i]["name"] === undefined && products[i]["quantity"] === undefined){
                    continue;
                } else{
                    items += products[i]["name"] + ":" 
                    + "&emsp;&emsp;&emsp;&emsp;&emsp;" + products[i]["quantity"]; 

                    items += "<br><br>";
                }   
            }

            items += `Want to delete an item?<br>
            <input type="text" id="delete-item" name="" value="" placeholder="Title Case e.g Blue Grecian ">
            <input id="delete-item-button" type="button" name="" value="Delete Item">`;
            list.html(items);
        }
    };

    console.log(list.html());
   
    function delete_product_item(){
        var delete_item = $('#delete-item').val();
        for(var i = 0; i < products.length; i++){
            if(delete_item === products[i]["name"]){
                if(products[i]["quantity"] > 1){
                    products[i]["quantity"] -= 1;
                }else{
                    delete products[i];
                    // delete products[i]["quantity"];
                }
            }
        }

        localStorage.setItem("shoppingCart", JSON.stringify(products));
     }

    function isItemInCart(item_id){
        var currentCart = JSON.parse(localStorage.getItem('shoppingCart'));
        console.log(currentCart);
        if (!currentCart){
            return false;
        }
        for(var i=0;i<currentCart.length;i++){
            if(currentCart[i]["name"]==productIds[item_id]["name"]){
                return true;
            }
        }
        return false;
    }

    function addItemToCart(item_id){
        var new_id = item_id + '-cart';
        if(!isItemInCart(new_id)){
            //item is not in the cart, add item
            var currentCart = JSON.parse(localStorage.getItem('shoppingCart'));
            if (!currentCart){
                currentCart = [];
            }
            //console.log(productIds,item_id)
            var product = { "id": new_id, "name": productIds[new_id]["name"], "price": productIds[new_id]["price"], "quantity": 1 };
            currentCart.push(product);
            //pushing item to local storage
            localStorage.setItem("shoppingCart", JSON.stringify(currentCart));

            } else{
            //item is in cart, update item
            var currentCart = JSON.parse(localStorage.getItem('shoppingCart'));
            for(var i=0;i<currentCart.length;i++){
                if(currentCart[i]["name"]==productIds[new_id]["name"]){
                    currentCart[i]["quantity"]+=1;
                }
            }
            localStorage.setItem("shoppingCart", JSON.stringify(currentCart));
        }
    }
    
    function removeItemFromCart(item_id){
        item_id = '#' + item_id;
    }

    //drag and drop event handlers
    function dragstart_handler(event) {
        console.log("dragStart");
        event.dataTransfer.setData("itemId", event.target.id);
        //ev.dataTransfer.dropEffect = "copy";
    }

    function dragover_handler(event) {
        //to enable elements accept drop events, I prevent 
        // default event behavior of dragover and dragenter
        event.preventDefault();
        console.log('dragover_handler');
    }
    function allowDrop(event) {
        event.preventDefault();
    }

    function drop_handler(event) {
        event.preventDefault();

        var event_id = event.dataTransfer.getData('itemId');
        if(event_id === '') return;

        addItemToCart(event_id);
        displayCartItems();
        console.log("dropped: " + event_id);
    }

    function dragOut(event){
        if (event.dataTransfer.dropEffect === 'none') {
            removeItemFromCart(event.target.id);
        }
    }
 
    function dragleave_handler(event){
        // $('.cart-container').removeClass('drag-enter');
    }

     //add event listener to all shop products

    for(var i = 0; i < draggableItems.length; i++){
        draggableItems[i].addEventListener('dragstart', dragstart_handler);
    }

    //add event listeners to cart
    cart.addEventListener('dragover', dragover_handler);
    cart.addEventListener('dragover', allowDrop);
    cart.addEventListener('drop', drop_handler);
    cart.addEventListener('dragleave', dragleave_handler);

    function showByCategory(id){
        var active_class = $('.active');
        var slice_clicked_class = id.slice(8);
        var clicked_class = $('.' + slice_clicked_class);

        $('.products-list a').removeClass('active');
        clicked_class.addClass('active');
         $('.products').hide();
        clicked_class.show();
  }

    //Show shop items by categories
   $('.products-list a').on('click', function(event){
       showByCategory(event.target.id);
       //console.log("event slice", (event.target.id).slice(8));
  });

  //delete item from cart
   $('#delete-item-button').on('click', function(){
       delete_product_item();

       console.log("delete button working");
  });


});