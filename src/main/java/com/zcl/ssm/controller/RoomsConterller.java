package com.zcl.ssm.controller;

import com.zcl.ssm.entity.Rooms;
import com.zcl.ssm.utils.FileUploadUtils;
import com.zcl.ssm.utils.QiniuUploadUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Controller
@RequestMapping("/rooms")
public class RoomsConterller extends BaseController<Rooms> {

    /*@RequestMapping("/uploadRoomPic")
    public @ResponseBody Map<String,Object> uploadRoomPic(String path, MultipartFile myFile){
            return FileUploadUtils.upload(path,myFile);
    }*/
    @RequestMapping("/uploadRoomPic")
    public @ResponseBody Map<String,Object> uploadRoomPic( MultipartFile myFile) {
        return QiniuUploadUtils.upload( myFile);
    }
}
