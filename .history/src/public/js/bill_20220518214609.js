var serviceBtn = document.querySelector(".show-service-btn");
var serviceList = document.querySelector(".collapse-list");
var height = serviceList.style.maxHeight;
serviceBtn.addEventListener('click', function() {
	console.log('height ' + height)
  if(height == '0px') {
	  console.log('max = 0')
		serviceList.style.maxHeight = '105px';
		serviceList.style.padding = '16px';
  } else {
	console.log('max = 105')
		serviceList.style.maxHeight = '0px';
		// serviceList.style.padding = '0px';
  }
});

// coll.addEventListener("click", function() {
//   this.classList.toggle("active");
//   var content = this.nextElementSibling;
//   if (content.style.display === "block") {
//     content.style.display = "none";
//   } else {
//     content.style.display = "block";
//   }
// });

