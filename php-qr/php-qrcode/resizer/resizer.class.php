<?php
/*
 * @version 1.0.0
 */
class Resize {


    /**
     * Получить расширение файла без точки в нижнем регистре
     * @throws Exception Если не удалось распознать расширение
     * @param string $path Путь к изображению
     * @return string Расширение файла без точки
     */
    private static function GetExtension($path) {
        $last_dot_pos = strrpos($path, '.', strlen($path)-5);
        if ($last_dot_pos !== false) {
            return strtolower(substr($path, $last_dot_pos+1));
        }

        throw new Exception('Не удалось получить расширение файла '.$path);
    }

    /**
     * Получить загруженное изображение
     * @throws Exception При невозможности загрузить изображение
     * @param string $path Путь к изображению
     * @return resource Ресурс загруженного файла
     */
    private static function GetImageResource($path) {
        $functions_in = array(
            'jpg'=>'imagecreatefromjpeg',
            'jpeg'=>'imagecreatefromjpeg',
            'png'=>'imagecreatefrompng',
            'gif'=>'imagecreatefromgif',
            'webp'=>'imagecreatefromwebp'
        );

        try {
            $ext = self::GetExtension($path);
            if (array_key_exists($ext, $functions_in)) {
                if ($functions_in[$ext] === 'imagecreatefromjpeg' && exif_imagetype($path) !== IMAGETYPE_JPEG) {
                    if (exif_imagetype($path) === IMAGETYPE_PNG) {
                        $ext = 'png';
                    } else if (exif_imagetype($path) === IMAGETYPE_GIF) {
                        $ext = 'gif';
                    } else {
                        throw new Exception('Неверное расширение изображения '.$path);
                    }
                } else if ($functions_in[$ext] === 'imagecreatefrompng' && exif_imagetype($path) !== IMAGETYPE_PNG) {
                    if (exif_imagetype($path) === IMAGETYPE_JPEG) {
                        $ext = 'jpg';
                    } else if (exif_imagetype($path) === IMAGETYPE_GIF) {
                        $ext = 'gif';
                    } else {
                        throw new Exception('Неверное расширение изображения '.$path);
                    }
                }
                $image = $functions_in[$ext]($path);
                if ($image !== false) {
                    return $image;
                }
                throw new Exception('Не удалось загрузить изображение в память '.$path);
            } else {
                throw new Exception('Неизвестное расширение изображения '.$ext);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    private static function CreatePlate($image_width, $image_height, $params) {
        $plate_width = $params['plate']['width'];
        $plate_height = $params['plate']['height'];
        $plate_color = $params['plate_color'];
        $plate_alpha = $params['plate_alpha'];

        if ($plate_width === 'auto') {
            $plate_width = $image_width;
        }
        if ($plate_height === 'auto') {
            $plate_height = $image_height;
        }

        $new_image = imagecreatetruecolor($plate_width, $plate_height);

        if ($plate_alpha !== false) {
            $color = call_user_func_array('imagecolorallocatealpha', array_merge(array($new_image), $plate_color, array($plate_alpha)));
        } else {
            $color = call_user_func_array('imagecolorallocate', array_merge(array($new_image), $plate_color));
        }
        imagefill($new_image, 0, 0, $color);

        return array($new_image, $plate_width, $plate_height);
    }

    public static function ParsePosition($position) {
        $result = array();

        $first_character = substr($position, 0, 1);
        if ($first_character === 'l') {
            $result[] = 'left';
        } else if ($first_character === 'c') {
            $result[] = 'center';
        } else {
            $result[] = 'right';
        }

        $position = substr($position, strlen($result[0]));
        $first_character = substr($position, 0, 1);
        if ($first_character === 't') {
            $result[] = 'top';
        } else if ($first_character === 'c') {
            $result[] = 'center';
        } else {
            $result[] = 'bottom';
        }
        return $result;
    }

    public static function ResizeImage($image, $params) {
        //Размеры исходного изображения
        $original_width = imagesx($image);
        $original_height = imagesy($image);

        $src_x = 0;
        $src_y = 0;
        $src_w = $original_width;
        $src_h = $original_height;

        if (isset($params['crop'])) {
            if ($params['crop'][0] > $original_width || $params['crop'][1] > $original_height) {
                throw new Exception('Ошибка в параметрах crop');
            }

            $index_rgb = imagecolorat($image, $params['crop'][0], $params['crop'][1]);

            $delete_from_left = 0;
            $delete_from_right = 0;
            $delete_from_top = 0;
            $delete_from_bottom = 0;

            $valid = true;
            for ($x = 0; $x < $original_width; ++$x) {
                for ($y = 0; $y < $original_height; ++$y) {
                    $rgb = imagecolorat($image, $x, $y);
                    if ($index_rgb != $rgb) {
                        $valid = false;
                        break;
                    }
                }
                if (!$valid) {
                    $delete_from_left = max($x, 0);
                    break;
                }
            }

            $valid = true;
            for ($x = 0; $x < $original_width; ++$x) {
                for ($y = 0; $y < $original_height; ++$y) {
                    $rgb = imagecolorat($image, $original_width-1-$x, $y);
                    if ($index_rgb != $rgb) {
                        $valid = false;
                        break;
                    }
                }
                if (!$valid) {
                    $delete_from_right = max($x, 0);
                    break;
                }
            }

            $valid = true;
            for ($y = 0; $y < $original_height; ++$y) {
                for ($x = 0; $x < $original_width; ++$x) {
                    $rgb = imagecolorat($image, $x, $y);
                    if ($index_rgb != $rgb) {
                        $valid = false;
                        break;
                    }
                }
                if (!$valid) {
                    $delete_from_top = max($y, 0);
                    break;
                }
            }

            $valid = true;
            for ($y = 0; $y < $original_height; ++$y) {
                for ($x = 0; $x < $original_width; ++$x) {
                    $rgb = imagecolorat($image, $x, $original_height-1-$y);
                    if ($index_rgb != $rgb) {
                        $valid = false;
                        break;
                    }
                }
                if (!$valid) {
                    $delete_from_bottom = max($y, 0);
                    break;
                }
            }

            $src_w = $original_width-$delete_from_left-$delete_from_right;
            $src_h = $original_height-$delete_from_top-$delete_from_bottom;
            $src_x = $delete_from_left;
            $src_y = $delete_from_top;
            $original_width = $src_w;
            $original_height = $src_h;
        }

        $need_width = $params['resize']['width']; //Размеры в которые превратить
        $need_height = $params['resize']['height']; //

        //Проверяем маленькое ли изображение
        $small_image = false;
        if ($need_width === 'auto') {
            if ($need_height > $original_height) {
                $small_image = true;
            }
        } else if ($need_height === 'auto') {
            if ($need_width > $original_width) {
                $small_image = true;
            }
        } else if ($need_width > $original_width && $need_height > $original_height) {
            $small_image = true;
        }

        $new_width = $need_width;
        $new_height = $need_height;

        if ($small_image) {
            //Обрабатываем его как маленькое
            switch ((int)$params['resize_small']) {
                case 1:
                    //Оставляем как есть
                    $new_width = $original_width;
                    $new_height = $original_height;
                    break;
                case 2:
                    //Расширить пропорционально без "белых полей" отрезать лишнее
                    if ($need_width === 'auto') {
                        $new_width = $original_width * $need_height / $original_height;
                    } else if ($need_height === 'auto') {
                        $new_height = $original_height * $need_width / $original_width;
                    } else {
                        $new_width = $original_width * $need_height / $original_height;
                        if ($new_width < $need_width) {
                            $new_height = $original_height * $need_width / $original_width;
                            $new_width = $need_width;
                        }
                    }
                    break;
                case 3:
                    //Расширить пропорционально с "белыми полями" вписать изображение
                    if ($need_width === 'auto') {
                        $new_width = $original_width * $need_height / $original_height;
                    } else if ($need_height === 'auto') {
                        $new_height = $original_height * $need_width / $original_width;
                    } else {
                        $new_width = $original_width * $need_height / $original_height;
                        if ($new_width > $need_width) {
                            $new_height = $original_height * $need_width / $original_width;
                            $new_width = $need_width;
                        }
                    }
                    break;
                case 4:
                    //Расширить не пропоционально (до нужного)
                    break;
            }
        } else {
            //Обрабатываем как большое
            switch ((int)$params['resize_type']) {
                case 1:
                    //Пропорционально без "белых полей" отрезать лишнее
                    if ($need_width === 'auto') {
                        $new_width = $original_width * $need_height / $original_height;
                    } else if ($need_height === 'auto') {
                        $new_height = $original_height * $need_width / $original_width;
                    } else {
                        $new_width = $original_width * $need_height / $original_height;
                        if ($new_width < $need_width) {
                            $new_height = $original_height * $need_width / $original_width;
                            $new_width = $need_width;
                        }
                    }
                    break;
                case 2:
                    //Пропорционально с "белыми полями" вписать изображение
                    if ($need_width === 'auto') {
                        $new_width = $original_width * $need_height / $original_height;
                    } else if ($need_height === 'auto') {
                        $new_height = $original_height * $need_width / $original_width;
                    } else {
                        $new_width = $original_width * $need_height / $original_height;
                        if ($new_width > $need_width) {
                            $new_height = $original_height * $need_width / $original_width;
                            $new_width = $need_width;
                        }
                    }
                    break;
                case 3:
                    //Не пропорционально (до нужного)
                    break;
            }
        }

        $new_width = floor($new_width);
        $new_height = floor($new_height);

        //Создаем plate
        list($new_image, $plate_width, $plate_height) = self::CreatePlate($new_width, $new_height, $params);

        $dst_x = 0;
        $dst_y = 0;
        $dst_w = $new_width;
        $dst_h = $new_height;

        $position = self::ParsePosition($params['position']);
        if ($position[0] === 'center') {
            $dst_x = ($plate_width - $new_width) / 2;
        } else if ($position[0] === 'right') {
            $dst_x = $plate_width - $new_width;
        }

        if ($position[1] === 'center') {
            $dst_y = ($plate_height - $new_height) / 2;
        } else if ($position[1] === 'bottom') {
            $dst_y = $plate_height - $new_height;
        }

        imagecopyresampled($new_image, $image, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h);

        if (isset($params['watermark']) && !empty($params['watermark'])) {
            if (file_exists($params['watermark']['path'])) {
                //Накладываем watermark
                $watermark = self::GetImageResource($params['watermark']['path']);

                $w_src_x = 0;
                $w_src_y = 0;
                $w_src_w = imagesx($watermark);
                $w_src_h = imagesy($watermark);

                $w_dst_x = 0;
                $w_dst_y = 0;
                $w_dst_w = $w_src_w;
                $w_dst_h = $w_src_h;

                $fill = $params['watermark']['fill'];
                if ($fill === 'repeat') {
                    //TODO: Реализовать
                } else if ($fill === 'resize') {
                    $w_need_width = $plate_width; //Размеры в которые превратить
                    $w_need_height = $plate_height; //
                    $w_new_width = $w_src_w;
                    $w_new_height = $w_src_h;

                    switch ((int)$params['watermark']['resize_type']) {
                        case 1:
                            //Пропорционально без "белых полей" отрезать лишнее
                            $w_new_width = $w_src_w * $w_need_height / $w_src_h;
                            if ($w_new_width < $w_need_width) {
                                $w_new_height = $w_src_h * $w_need_width / $w_src_w;
                                $w_new_width = $w_need_width;
                            }
                            break;
                        case 2:
                            //Пропорционально с "белыми полями" вписать изображение
                            $w_new_width = $w_src_w * $w_need_height / $w_src_h;
                            if ($w_new_width > $w_need_width) {
                                $w_new_height = $w_src_h * $w_need_width / $w_src_w;
                                $w_new_width = $w_need_width;
                            }
                            break;
                        case 3:
                        default:
                            //Не пропорционально (до нужного)
                            $w_new_width = $plate_width;
                            $w_new_height = $plate_height;
                            break;
                    }
                    $w_dst_w = $w_new_width;
                    $w_dst_h = $w_new_height;
                }

                $w_dst_w = floor($w_dst_w);
                $w_dst_h = floor($w_dst_h);

                $position = self::ParsePosition($params['watermark']['position']);
                if ($position[0] === 'center') {
                    $w_dst_x = ($plate_width - $w_dst_w) / 2;
                } else if ($position[0] === 'right') {
                    $w_dst_x = $plate_width - $w_dst_w;
                }

                if ($position[1] === 'center') {
                    $w_dst_y = ($plate_height - $w_dst_h) / 2;
                } else if ($position[1] === 'bottom') {
                    $w_dst_y = $plate_height - $w_dst_h;
                }

                imagecopyresampled($new_image, $watermark, $w_dst_x, $w_dst_y, $w_src_x, $w_src_y, $w_dst_w, $w_dst_h, $w_src_w, $w_src_h);
            }
        }

        //$color = imagecolorallocate($new_image, 255, 255, 255);
        for ($y = 0; $y < $dst_h; ++$y) {
            $should_fix_line = true;
            for ($x = 0; $x < $dst_w; ++$x) {
                $index_rgb = imagecolorat($new_image, $x, $y);
                $colors = imagecolorsforindex($new_image, $index_rgb);
                if (!in_array($colors['red'], array(254, 255)) || !in_array($colors['green'], array(254, 255)) || !in_array($colors['blue'], array(254, 255))) {
                    $should_fix_line = false;
                }
            }

            if ($should_fix_line) {
                $color = imagecolorallocatealpha($new_image, 255, 255, 255, imagecolorsforindex($new_image, imagecolorat($new_image, 0, $y))['alpha']);
                for ($x = 0; $x < $dst_w; ++$x) {
                    imagesetpixel($new_image, $x, $y, $color);
                }
            }
        }

        for ($x = 0; $x < $dst_w; ++$x) {
            $should_fix_line = true;
            for ($y = 0; $y < $dst_h; ++$y) {
                $index_rgb = imagecolorat($new_image, $x, $y);
                $colors = imagecolorsforindex($new_image, $index_rgb);
                if (!in_array($colors['red'], array(254, 255)) || !in_array($colors['green'], array(254, 255)) || !in_array($colors['blue'], array(254, 255))) {
                    $should_fix_line = false;
                }
            }

            if ($should_fix_line) {
                $color = imagecolorallocatealpha($new_image, 255, 255, 255, imagecolorsforindex($new_image, imagecolorat($new_image, $x, 0))['alpha']);
                for ($y = 0; $y < $dst_h; ++$y) {
                    imagesetpixel($new_image, $x, $y, $color);
                }
            }
        }

        return $new_image;
    }

    /**
     * Ужать исходный диапазон в заданных размерах
     * [0 10] до [0 100]
     * @param int $value Значение параметра
     * @param int $lmin Исходное минимальное
     * @param int $lmax Исходное максимальное
     * @param int $rmin Заданное минимальное
     * @param int $rmax Заданное максимальное
     * @return int Значение в новом диапазоне
     */
    private static function MapValue($value, $lmin, $lmax, $rmin, $rmax) {
        return (($value - $lmin)*($rmax-$rmin))/($lmax-$lmin);
    }

    private static function SaveImage($image, $path, $quality, $progressive) {
        $functions_out = array(
            'jpg'=>'imagejpeg',
            'jpeg'=>'imagejpeg',
            'png'=>'imagepng',
            'gif'=>'imagegif',
            'webp'=>'imagewebp'
        );

        try {
            $ext = self::GetExtension($path);
            if (array_key_exists($ext, $functions_out)) {
                $params = array($image, $path);
                if ($ext === 'webp') {
                    imagealphablending($params[0], false);
                    imagesavealpha($params[0], true);

                    $params[] = $quality;
                } else if ($ext === 'png') {
                    imagealphablending($params[0], false);
                    imagesavealpha($params[0], true);

                    $quality = (int)(10-self::MapValue($quality, 0, 100, 0, 9));
                    $params[] = $quality;
                } else if ($ext === 'jpg' || $ext === 'jpeg') {
                    $params[] = $quality;
                    if ($progressive) {
                        imageinterlace($image, 1);
                    }
                }

                if (call_user_func_array($functions_out[$ext], $params)) {
                    return true;
                }
                throw new Exception('Не удалось сохранить изображение по пути '.$path);
            } else {
                throw new Exception('Неизвестное расширение изображения '.$ext);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    private static function CheckParams($params) {
        //Наличие обязательных полей
        $required_fields = array('resize_type', 'resize');
        foreach ($required_fields as $required_field) {
            if (!array_key_exists($required_field, $params)) {
                throw new Exception('Не заполнен параметр '.$required_field);
            }
        }

        if (!is_array($params['resize'])) {
            throw new Exception('Неверный формат поля resize');
        }

        if (!array_key_exists('width', $params['resize'])) {
            throw new Exception('Не указано значение width для параметра resize');
        }

        if (!array_key_exists('height', $params['resize'])) {
            throw new Exception('Не указано значение height для параметра resize');
        }

        if ((string)$params['resize']['width'] === 'auto' && (string)$params['resize']['height'] === 'auto') {
            throw new Exception('Одновременно оба параметра width и height для параметра resize не могут быть auto');
        }

        if (!in_array((int)$params['resize_type'], array(1, 2, 3), true)) {
            throw new Exception('Неверное значение для параметра resize_type');
        }

        if (!array_key_exists('resize_small', $params)) {
            $params['resize_small'] = 1;
        }

        if (!in_array((int)$params['resize_small'], array(1, 2, 3, 4), true)) {
            throw new Exception('Неверное значение для параметра resize_small');
        }

        if (!array_key_exists('position', $params)) {
            $params['position'] = 'centercenter';
        }

        if (!in_array((string)$params['position'], array('lefttop', 'centertop', 'righttop', 'leftcenter',
            'centercenter', 'rightcenter', 'leftbottom', 'centerbottom', 'rightbottom'), true)) {
            throw new Exception('Неверное значение для параметра position');
        }

        if (!array_key_exists('quality', $params)) {
            $params['quality'] = 80;
        }
        $params['quality'] = (int)$params['quality'];
        if ($params['quality'] < 1 || $params['quality'] > 100) {
            throw new Exception('Неверное значение для параметра quality');
        }

        if (!array_key_exists('plate', $params)) {
            $params['plate'] = array('width'=>'auto', 'height'=>'auto');
        }
        if (!array_key_exists('width', $params['plate'])) {
            $params['plate']['width'] = 'auto';
        }
        if (!array_key_exists('height', $params['plate'])) {
            $params['plate']['height'] = 'auto';
        }

        if (!array_key_exists('plate_color', $params)) {
            $params['plate_color'] = array(255, 255, 255);
        }
        if (!is_array($params['plate_color']) || count($params['plate_color']) < 3) {
            throw new Exception('Неверное значение для параметра plate_color');
        }
        $params['plate_color'] = array_values($params['plate_color']);
        foreach (array(0, 1, 2) as $color_position) {
            if ($params['plate_color'][$color_position] < 0 || $params['plate_color'][$color_position] > 255) {
                throw new Exception('Неверный формат для параметра plate_color');
            }
        }

        if (!array_key_exists('plate_alpha', $params)) {
            $params['plate_alpha'] = false;
        }
        if ($params['plate_alpha'] !== false && ($params['plate_alpha'] < 0 || $params['plate_alpha'] > 127)) {
            throw new Exception('Неверный формат для параметра plate_alpha');
        }

        if (!array_key_exists('watermark', $params)) {
            $params['watermark'] = array();
        }

        if (!empty($params['watermark'])) {
            if (!array_key_exists('path', $params['watermark'])) {
                throw new Exception('Отсутствует путь к изображению watermark');
            }

            if (!file_exists($params['watermark']['path'])) {
                throw new Exception('Не найдено изображение watermark');
            }

            if (!array_key_exists('fill', $params['watermark'])) {
                $params['watermark']['fill'] = 'exact';
            }

            if (!array_key_exists('position', $params['watermark'])) {
                $params['watermark']['position'] = 'centercenter';
            }

            //TODO: Добавить доступность watermark
            if (!in_array($params['watermark']['fill'], array('exact', 'resize'), true)) {
                throw new Exception('Неверно заполнен параметр fill для watermark');
            }

            if (!in_array((string)$params['watermark']['position'], array('lefttop', 'centertop', 'righttop', 'leftcenter',
                'centercenter', 'rightcenter', 'leftbottom', 'centerbottom', 'rightbottom'), true)) {
                throw new Exception('Неверное значение для параметра position для watermark');
            }
        }

        if (array_key_exists('crop', $params)) {
            if (!is_array($params['crop']) || count($params['crop']) != 2 || !isset($params['crop'][0], $params['crop'][1]) || $params['crop'][0] < 0 || $params['crop'][1] < 0) {
                throw new Exception('Ошибка в параметрах crop');
            }
        }

        if (array_key_exists('progressive', $params)) {
            if (!in_array((int)$params['progressive'], array(0, 1))) {
                throw new Exception('Ошибка в параметрах progressive');
            }
        } else {
            $params['progressive'] = 0;
        }

        return $params;
    }

    /**
     * @param string $original_file_path Путь к оригинальному изображению
     * @param string $new_file_path Путь к новому изображению
     * @param array $params Параметры ужимания изображения
     * @throws Exception Ошибка, если на одном из шагов произошла ошибка
     */
    public static function Make($original_file_path, $new_file_path, $params) {
        if (!file_exists($original_file_path)) {
            throw new Exception('Не найдено исходное изображение');
        }

        try {
            $params = self::CheckParams($params);
            $original_image = self::GetImageResource($original_file_path);
            $new_image = self::ResizeImage($original_image, $params);
            self::SaveImage($new_image, $new_file_path, $params['quality'], $params['progressive']);
        } catch (Exception $e) {
            throw $e;
        }
    }
}