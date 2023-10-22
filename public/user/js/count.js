$(document).ready(function (){
    $('.countButton').on('click',function(){
        const clickedButton = this; 
        const itemId = clickedButton.dataset.itemId;
        const action = clickedButton.dataset.toDo
        console.log(itemId,action);
        const countInput = document.getElementById(`product-${itemId}`)
        const messageInput = document.getElementById(`warning-${itemId}`)
        const totalPriceInput = document.getElementById(`totalPrice-${itemId}`) 
        const totalPrice = document.getElementById('total')
        let count = parseInt(countInput.textContent)

        $.ajax({
            url:`/changeCount?itemId=${itemId}&action=${action}`,
            method:'POST',
            success: function (data){
                console.log(data.status)
                if(data.status === 'stock'){
                    messageInput.textContent = "stock limit exceeded"
                }
                else if(data.status === 'bag'){
                    messageInput.textContent = "cart size exceeded"
                }
                else if(data.status === 'done'){
                    countInput.textContent = ++count
                    totalPriceInput.textContent = `₹${count * data.price}`
                    totalPrice.textContent =  `₹${data.total}`
                }
                else if(data.status === 'minus'){
                    countInput.textContent = --count;
                    totalPriceInput.textContent = `₹${count * data.price}`
                    totalPrice.textContent =  `₹${data.total}`
                }
            }
        })
       
    })
})