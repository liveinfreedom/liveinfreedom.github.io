<?php
use chillerlan\QRCode\{QRCode, QROptions};
use chillerlan\QRCode\Common\EccLevel;
use chillerlan\QRCode\Output\QROutputInterface;

require './vendor/autoload.php';

$dataForQr = '| ID PDF-фала: 123 | Номер страницы: 5 |';
$qrImgPath = './img/qr.png';

$qrOptions = new QROptions([
    'version'    => 5,
    'outputType' => QROutputInterface::GDIMAGE_PNG,
    'eccLevel'   => EccLevel::M,
]);
$qr = new QRCode($qrOptions);
$qr->render($dataForQr, $qrImgPath);

// try{
//     $dataDecoded = (string)$qr->readFromFile($imgPath);
// }
// catch(Throwable $e){
//     $dataDecoded = 'Ошибка: '.$e->getMessage();
// }
// Данные QR: $dataDecoded

?>
<img src="<?= $qrImgPath ?>" alt="QR Code" />