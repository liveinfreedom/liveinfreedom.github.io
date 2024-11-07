<?php
require_once __DIR__.'/config.php';
require_once __DIR__.'/functions.php';

function IexGetResizedPath($path, $key) {
    global $iexResizerResizeDirs;
    global $iexResizerSizes;

    if (!isset($iexResizerSizes[$key])) {
        return false;
    }

    $last_slash_position = strrpos($path, '/');
    if ($last_slash_position !== false) {
        $filename = substr($path, strrpos($path, '/')+1);
        $have_get_params = strpos($filename, '?');
        if ($have_get_params !== false) {
            $filename = substr($filename, 0, $have_get_params);
        }
    } else {
        return '';
    }

    $from = $iexResizerResizeDirs;
    $to = array_fill(0, count($from), '/upload/iex_resize_cache/');

    $ext = iexResizerGetExtension($filename);
    if (isset($iexResizerSizes[$key]['convert'][$ext])) {
        $ext = $iexResizerSizes[$key]['convert'][$ext];
    }

    $from[] = $filename;
    $to[] = $key.'_'.$iexResizerSizes[$key]['resize']['width'].'x'.$iexResizerSizes[$key]['resize']['height'].'_'.md5($filename).'.'.$ext;

    return str_replace($from, $to, $path);
}