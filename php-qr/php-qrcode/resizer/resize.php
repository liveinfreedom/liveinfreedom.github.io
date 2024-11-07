<?php
require_once __DIR__.'/config.php';
require_once __DIR__.'/functions.php';
require_once __DIR__.'/resizer.class.php';

$url = isset($_GET['uri'])?trim((string)$_GET['uri']):'';
$url = iexResizerRemoveGetParams($url);

$filename = iexResizerGetFilename($url);
if ($filename === false) {
    exit;
}

$params = iexResizerGetParamsFromFilename($filename);
if ($params === false) {
    exit;
}

$type = $params['type'];
$md5 = $params['md5'];
if (!array_key_exists($type, $iexResizerSizes)) {
    iexResizerWriteLog('Неизвестный ключ '.$type.' '.$url);
    exit;
}

$ext = iexResizerGetExtension($url);
if (isset($iexResizerSizes[$type]['convert'][$ext])) {
    $url = iexResizerChangeExt($url, $iexResizerSizes[$type]['convert'][$ext]);
}
$resized_filepath = $_SERVER['DOCUMENT_ROOT'].$url;
$resized_dir = $_SERVER['DOCUMENT_ROOT'].iexResizerGetDirPath($url);
if (!file_exists($resized_dir) && !@mkdir($resized_dir, 0777, true) && !is_dir($resized_dir)) {
    iexResizerWriteLog('Не удалось создать папку для изображений '.$resized_dir);
}


$original_filepath = '';
foreach ($iexResizerResizeDirs as $dir_path) {
    $original_dir = str_replace('/upload/iex_resize_cache', $dir_path, $resized_dir);
    if (file_exists($original_dir)) {
        $dir = scandir($original_dir);
        foreach ($dir as $file) {
            if (!in_array($file, array('.', '..'), true)) {
                $ext = iexResizerGetExtension($file);
                if (isset($iexResizerSizes[$type]['convert'][$ext])) {
                    $ext = $iexResizerSizes[$type]['convert'][$ext];
                }
                if ($md5 === md5($file).'.'.$ext) {
                    $original_filepath = $original_dir.'/'.$file;
                    break 2;
                }

                if ($md5 === md5(rawurlencode($file)).'.'.$ext) {
                    $original_filepath = $original_dir.'/'.$file;
                    break 2;
                }
            }
        }
    }
}

if ($original_filepath === '') {
    if (mb_strpos($url, '@2x') === false) {
        iexResizerWriteLog('Не найдено исходное изображение для '.$url);
    }
    exit;
}

try {
    Resize::Make($original_filepath, $resized_filepath, $iexResizerSizes[$type]);
    header('Content-type: '.iexResizerGetHeaderByExtension(iexResizerGetExtension($resized_filepath)));
    echo file_get_contents($resized_filepath);
} catch (Exception $e) {
    iexResizerWriteLog('Ошибка '.$e->getMessage());
    exit;
}

?>