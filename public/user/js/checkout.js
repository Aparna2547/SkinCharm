$(".checkoutForm").submit((e) => {
  e.preventDefault();
  $.ajax({
    url: "/checkOut",
    method: "post",
    data: $(".checkoutForm").serialize(),
    success: function (res) {
        // console.log(res)
        if(res.status == 'CASH' || res.status == 'WALLET'){
            location.href = '/orderSuccess'
        }else if(res.status == 'ONLINE'){
            razorpayPayment(res.order,res.cart)
        }

    },
  });
});

function razorpayPayment(order,cart) {
    console.log(cart);
    var options = {
        "key": "rzp_test_HF244UzriBo0yU", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "SkinCharm",
        "description": "Test Transaction",
        "image": "/admin/assets/logo.png",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            verifyPayment(response, order,cart)
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
}


function verifyPayment(payment,order,cart){
    $.ajax({
        url:'/verifyPayment',
        method : 'post',
        data:{
            payment,
            order,
            cart
        },
        success:(res)=>{
            if(res.paymentSuccess === true){
                location.href = '/orderSuccess'
            }else{
                alert("payment failed")
            }
        }
    })
}