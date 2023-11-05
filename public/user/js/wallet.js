$(document).ready(function() {
    $('#use-wallet').click(function(){
        const clickedButton = this;
        const walletAmount = clickedButton.dataset.walletAmount;
        const toDo = clickedButton.dataset.toDo;

        $.ajax({
            url: `/apply_wallet/?action=${toDo}`,
            method:'post',
            dataType: 'json',
            success: function(data){
                if(data.success == true){
                        let lastAmount = data.subTotal-walletAmount;
                    if(lastAmount < 0){
                        lastAmount = 0
                    }
                    // $('#subTotal').text(lastAmount);
                }
                else{
                   
                }
                location.reload();
            }
        })
    })
})