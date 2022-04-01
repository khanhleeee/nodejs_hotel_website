
//lấy dữ liệu ngày nhận và đặt phòng và tính tiền phòng


var checkin = document.getElementById("checkin");
var checkout = document.getElementById("checkout");

checkin.onchange = function() {Total()}

checkout.onchange = function() {Total()}

function Total(){
    var d_checkin = checkin.value.slice(0,2);
    var d_checkout = checkout.value.slice(0,2);
    var m_checkin = checkin.value.slice(3,5);
    var m_checkout = checkout.value.slice(3,5);
    var number_dCheckin = parseInt(d_checkin);
    var number_dCheckout = parseInt(d_checkout);
    var number_mCheckin = parseInt(m_checkin);
    var number_mCheckout = parseInt(m_checkout);

    if(number_dCheckin < number_dCheckout && number_mCheckin == number_mCheckout){
        var total_Day = number_dCheckout - number_dCheckin;  
        var roomPrice = document.getElementById('room-price').textContent;
        var sum = parseInt(roomPrice);
        sum= sum* total_Day*1000;
        var total = document.getElementById('total').innerText = sum +"VND";
    }

    else if(number_dCheckin > number_dCheckout && m_checkin < m_checkout){
        switch(number_mCheckin){
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                var total_Day = 31 - number_dCheckin + number_dCheckout;  
                var roomPrice = document.getElementById('room-price').textContent;
                var sum = parseInt(roomPrice);
                sum= sum* total_Day* 1000;
                var total = document.getElementById('total').innerText = sum +"VND";
            break;
        }  

        switch(number_mCheckin){
            case 4:
            case 6:
            case 9:
            case 11:
                var total_Day = 30 - number_dCheckin + number_dCheckout;  
                var roomPrice = document.getElementById('room-price').textContent;
                var sum = parseInt(roomPrice);
                sum= sum* total_Day* 1000;
                var total = document.getElementById('total').innerText = sum +"VND";

            break;
        }  

        switch(number_mCheckin){
            case 2:
                var total_Day = 28 - number_dCheckin + number_dCheckout;  
                var roomPrice = document.getElementById('room-price').textContent;
                var sum = parseInt(roomPrice);
                sum= sum* total_Day* 1000;
                var total = document.getElementById('total').innerText = sum +"VND";

            break;
        }

    }

}




