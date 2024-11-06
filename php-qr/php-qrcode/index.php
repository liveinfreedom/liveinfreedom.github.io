<?php
use chillerlan\QRCode\{QRCode, QROptions};
use chillerlan\QRCode\Common\EccLevel;
use chillerlan\QRCode\Output\QROutputInterface;

require './vendor/autoload.php';

$dataSrc = 'otpauth://totp/test?secret=B3JX4VCVJDVNXNZ5&issuer=chillerlan.net';
$dataDecoded = '';
$imgPath = './big.png';

$options = new QROptions([
    'version'    => 5,
    'outputType' => QROutputInterface::GDIMAGE_PNG,
    'eccLevel'   => EccLevel::M,
]);

$qr = new QRCode($options);
// $qr->render($dataSrc, $imgPath);

try{
    $dataDecoded = (string)$qr->readFromFile($imgPath);
}
catch(Throwable $e){
    $dataDecoded = 'Ошибка: '.$e->getMessage();
}

?>
<img src="<?= $imgPath ?>" alt="QR Code" />
<br>
Данные в QR-коде: <?= $dataDecoded ?>