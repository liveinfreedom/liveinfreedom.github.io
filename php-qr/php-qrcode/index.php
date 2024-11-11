<?php
use chillerlan\QRCode\{QRCode, QROptions};
use chillerlan\QRCode\Common\EccLevel;
use chillerlan\QRCode\Output\QROutputInterface;

require './vendor/autoload.php';

$dataForQr = ['fileId'=>123, 'pageNum'=>4];
$qrImgPath = './img/qr.png';

$qrOptions = new QROptions([
    'version'    => 5,
    'outputType' => QROutputInterface::GDIMAGE_PNG,
    'eccLevel'   => EccLevel::M,
]);
$qr = new QRCode($qrOptions);
$qr->render(json_encode($dataForQr), $qrImgPath);

$decodingErr = '';
try{
    $decodedData = (string)$qr->readFromFile($qrImgPath);
} catch(Throwable $e){
    $decodingErr = 'Ошибка: '.$e->getMessage();
}

?>
<img src="<?= $qrImgPath ?>" alt="QR Code" /><br>
<pre>
    Данные в QR-коде:<?= $decodingErr ?: print_r(json_decode($decodedData, true), true) ?>
</pre>