
var serviceBtn = document.querySelector(".show-service-btn");
var serviceList = document.querySelector(".service-list");

serviceBtn.addEventListener('click', function() {
	var height = serviceList.style.opacity
  if(height === '0') {
		serviceList.style.opacity = '1';
  } else {
	serviceList.style.opacity = '0';
  }
});

// Add service
// var serviceContainer = document.querySelector('#service-container');
// var serviceRow = serviceContainer.querySelectorAll('tr');
// var services = document.querySelectorAll('.service-item');
var add_btn = document.querySelectorAll('.servie-add i');
console.log(add_btn)
var remove_btn = document.querySelectorAll('.service-remove');

// REMOVE SERVICE
// remove_btn.forEach(btn => {
// 	btn.addEventListener('click', function(e) {
// 		var btn_remove = e.target;
// 		var tr = btn_remove.parentElement.parentElement.parentElement;
// 		tr.remove();
// 	})
// })


// ADD SERVICE
add_btn.forEach(add => {
	add.addEventListener('click', function(e) {
		var addBtn = e.target;
		var service = addBtn.parentElement.parentElement.parentElement;
		
		if(service.tagName == 'TR') {
			var sv_name = service.getElementsByClassName('sv-name')[0].innerText;
			console.log(sv_name);
			var sv_type = service.getElementsByClassName('sv-type')[0].innerText;
			var sv_price = service.getElementsByClassName('sv-price')[0].innerText;
			AddSerive(sv_name, sv_type, sv_price);
		}
	})
})




function AddSerive(name, type, price) {
	var serviceContainer = document.querySelector('#service-container');
	var serviceRow = serviceContainer.querySelectorAll('tr');
	var service_row = document.createElement('tr');
	var serviceContent = ``;
	var item = {};

	for(var i = 0; i < serviceRow.length; i++) {
		var item_title = serviceRow[i].getElementsByClassName('sv-title')[0].innerText;
		var item_price = serviceRow[i].getElementsByClassName('sv-qty')[0].innerText;
		if(item_title === name) {
			alert('Sản Phẩm Đã Có Trong Giỏ Hàng');
		}
		else {
			item = { name: name, type: type, qty: 1, price: price}
			
	}
	}
	serviceContent += `
			<td class="sv-title">${item.name}</td>
			<td>${item.type}</td>
			<td>${item.price}</td>
			<td class="sv-qty">${item.qty}</td>
			<td>0</td>
			<td style="min-width: 0;">
				<div class="status-btn-circle service-remove"> <i class="fas fa-minus"></i></div>
			</td>
		`
			service_row.innerHTML = serviceContent;
			serviceContainer.append(service_row);
			service_row.querySelector('.service-remove').addEventListener('click', function (e) {
				var btn_remove = e.target;
				var tr = btn_remove.parentElement.parentElement.parentElement;
				tr.remove();
		})
}

// var serviceData = '';
// if(serviceRow.length === 0) {
// 	serviceData += `
// 	<tr>
// 		<td colspan="5">Chưa có dịch vụ</td>
// 	</tr>
// 	`
// 	serviceContainer.innerHTML = serviceData;
// }



