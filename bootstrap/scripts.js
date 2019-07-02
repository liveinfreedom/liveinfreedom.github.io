/*
// Для работы в Windows Phone 8
// http://getbootstrap.com/docs/4.0/getting-started/browsers-devices/
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement('style')
    msViewportStyle.appendChild(
        document.createTextNode(
            '@-ms-viewport{width:auto!important}'
        )
    )
    document.head.appendChild(msViewportStyle)
}
*/

$(function () {
    console.log('jQuery is ready!');
    console.log('.col* count:', $('[class*="col"]').length );
});