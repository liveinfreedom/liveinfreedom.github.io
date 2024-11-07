<?php
function iexResizerGetExtension($path) {
    $last_dot_pos = strrpos($path, '.', strlen($path)-5);
    if ($last_dot_pos !== false) {
        return strtolower(substr($path, $last_dot_pos+1));
    }
    return '';
}

function iexResizerRemoveGetParams($url) {
    $getParamsStartPosition = strpos($url, '?');
    if ($getParamsStartPosition !== false) {
        $url = substr($url, 0, $getParamsStartPosition);
    }
    return $url;
}

function iexResizerGetFilename($url) {
    $lastSlashPosition = strrpos($url, '/');
    if ($lastSlashPosition === false) {
        iexResizerWriteLog('Не найден / в пути '.$url);
        return false;
    }
    return substr($url, $lastSlashPosition+1);
}

function iexResizerGetDirPath($url) {
    $lastSlashPosition = strrpos($url, '/');
    if ($lastSlashPosition === false) {
        iexResizerWriteLog('Не найден / в пути '.$url);
        return false;
    }
    return substr($url, 0, $lastSlashPosition);
}

function iexResizerGetParamsFromFilename($filename) {
    $pos = strrpos($filename, '_');
    if ($pos === false) {
        iexResizerWriteLog('Неверное имя файла - нет _ '.$filename);
        return false;
    }

    $typeAndSize = substr($filename, 0, $pos);
    $md5 = substr($filename, $pos+1);

    $pos = strrpos($typeAndSize, '_');
    if ($pos === false) {
        iexResizerWriteLog('Неверное имя файла - нет типа/размера '.$filename);
        return false;
    }

    $type = substr($typeAndSize, 0, $pos);
    $size = substr($typeAndSize, $pos+1);

    return [
        'type'=>$type,
        'size'=>$size,
        'md5'=>$md5
    ];
}

function iexResizerWriteLog($message) {
    $fh = fopen(__DIR__.'/images_errors.log', 'ab');
    fwrite($fh, date('Y-m-d H:i:s').' '.$message."\n");
    fclose($fh);
}

function iexResizerGetHeaderByExtension($ext) {
    $headers = array(
        'jpg'=>'image/jpeg',
        'jpeg'=>'image/jpeg',
        'png'=>'image/png',
        'gif'=>'image/gif'
    );

    if (array_key_exists($ext, $headers)) {
        return $headers[$ext];
    }

    return '';
}

function iexResizerChangeExt($filepath, $to_ext) {
    $ext = iexResizerGetExtension($filepath);
    if ($ext !== $to_ext) {
        $filepath = str_replace('.'.$ext, '.'.$to_ext, $filepath);
    }
    return $filepath;
}
?>