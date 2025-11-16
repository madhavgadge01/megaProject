// src/components/RTE.jsx
import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import conf from "../conf/conf"; // optional: conf.tinyApiKey or use env

export default function RTE({ name = "content", control, label, defaultValue = "" }) {
  const apiKey = conf?.tinyApiKey || import.meta.env.VITE_TINY_API_KEY || "1ksy8gfylre42wmx3fwfem1mncfrg1m7ywr6vcvhdmucimvk";

  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Editor
            apiKey={apiKey}
            value={field.value}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "image","advlist","autolink","lists","link","charmap","preview","anchor",
                "searchreplace","visualblocks","code","fullscreen","insertdatetime","media",
                "table","help","wordcount"
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            }}
            onEditorChange={(content) => field.onChange(content)}
          />
        )}
      />
    </div>
  );
}