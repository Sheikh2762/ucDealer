 function goToForm(packageName, price) {
    window.location.href = `form.html?package=${encodeURIComponent(packageName)}&price=${encodeURIComponent(price)}`;