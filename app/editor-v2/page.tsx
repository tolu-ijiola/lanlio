"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { EditorShell } from "@/components/editor-v2/shell";
import { EditorProvider, useEditorStore } from "@/stores/editor-v2/store";

function EditorContent() {
  const searchParams = useSearchParams();
  const websiteId = searchParams.get("id");
  const templateId = searchParams.get("template");
  
  const { initializeEditor, loadWebsite, loadTemplate } = useEditorStore();

  useEffect(() => {
    if (websiteId) {
      loadWebsite(websiteId);
    } else if (templateId) {
      loadTemplate(templateId);
    } else {
      initializeEditor();
    }
  }, [websiteId, templateId]);

  return <EditorShell />;
}

export default function EditorV2Page() {
  return (
    <EditorProvider>
      <EditorContent />
    </EditorProvider>
  );
}

