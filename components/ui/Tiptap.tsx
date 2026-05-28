"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Code,
  Braces,
  Undo2,
  Redo2,
} from "lucide-react";
import { Button } from "./button";
import { useState, useCallback } from "react";

interface TiptapProps {
  content?: string;
  onChange?: (html: string) => void;
  editable?: boolean;
  placeholder?: string;
}

const ToolbarButton = ({
  onClick,
  active,
  children,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  label: string;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="icon-sm"
    onClick={onClick}
    data-active={active || undefined}
    className={`cursor-pointer rounded-sm ${
      active
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`}
    aria-label={label}
    title={label}
  >
    {children}
  </Button>
);

const HeadingButton = ({
  editor,
  level,
  label,
  children,
}: {
  editor: Editor;
  level: 1 | 2 | 3;
  label: string;
  children: React.ReactNode;
}) => (
  <ToolbarButton
    onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
    active={editor.isActive("heading", { level })}
    label={label}
  >
    {children}
  </ToolbarButton>
);

const Tiptap = ({
  content = "",
  onChange,
  editable = true,
  placeholder = "Start writing...",
}: TiptapProps) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      LinkExtension.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || "<p></p>",
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const handleLinkClick = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    if (previousUrl) {
      setLinkUrl(previousUrl);
    } else {
      setLinkUrl("");
    }
    setShowLinkInput(true);
  }, [editor]);

  const handleLinkSave = useCallback(() => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const handleLinkRemove = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b bg-muted/30">
        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          label="Undo"
        >
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          label="Redo"
        >
          <Redo2 className="size-4" />
        </ToolbarButton>

        <div className="w-px h-5 mx-1 bg-border" />

        {/* Bold / Italic / Strike */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="Bold"
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="Italic"
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          label="Strikethrough"
        >
          <Strikethrough className="size-4" />
        </ToolbarButton>

        <div className="w-px h-5 mx-1 bg-border" />

        {/* Headings */}
        <HeadingButton editor={editor} level={1} label="Heading 1">
          <Heading1 className="size-4" />
        </HeadingButton>
        <HeadingButton editor={editor} level={2} label="Heading 2">
          <Heading2 className="size-4" />
        </HeadingButton>
        <HeadingButton editor={editor} level={3} label="Heading 3">
          <Heading3 className="size-4" />
        </HeadingButton>

        <div className="w-px h-5 mx-1 bg-border" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="Bullet List"
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="Ordered List"
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>

        <div className="w-px h-5 mx-1 bg-border" />

        {/* Code & Link */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          label="Inline Code"
        >
          <Code className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          label="Code Block"
        >
          <Braces className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={handleLinkClick}
          active={editor.isActive("link")}
          label="Link"
        >
          <Link className="size-4" />
        </ToolbarButton>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/20">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL..."
            className="flex-1 h-8 px-2 text-sm rounded border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLinkSave();
              if (e.key === "Escape") setShowLinkInput(false);
            }}
          />
          <Button
            type="button"
            size="sm"
            className="cursor-pointer h-8 text-xs px-3"
            onClick={handleLinkSave}
          >
            Save
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="cursor-pointer h-8 text-xs px-3"
            onClick={handleLinkRemove}
          >
            Remove
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <div className="px-3 py-2">
        <EditorContent
          editor={editor}
          className="prose prose-sm dark:prose-invert max-w-none focus:outline-none
            [&_.tiptap]:min-h-37.5 [&_.tiptap]:outline-none
            [&_.tiptap_p]:my-1 [&_.tiptap_h1]:text-xl [&_.tiptap_h1]:font-bold [&_.tiptap_h1]:mt-4 [&_.tiptap_h1]:mb-2
            [&_.tiptap_h2]:text-lg [&_.tiptap_h2]:font-semibold [&_.tiptap_h2]:mt-3 [&_.tiptap_h2]:mb-1.5
            [&_.tiptap_h3]:text-base [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:mt-2 [&_.tiptap_h3]:mb-1
            [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5
            [&_.tiptap_li]:my-0.5
            [&_.tiptap_code]:bg-muted [&_.tiptap_code]:text-sm [&_.tiptap_code]:px-1 [&_.tiptap_code]:py-0.5 [&_.tiptap_code]:rounded
            [&_.tiptap_pre]:bg-muted [&_.tiptap_pre]:p-3 [&_.tiptap_pre]:rounded-lg [&_.tiptap_pre]:overflow-x-auto
            [&_.tiptap_pre_code]:bg-transparent [&_.tiptap_pre_code]:p-0
            [&_.tiptap_blockquote]:border-l-2 [&_.tiptap_blockquote]:border-primary/30 [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:text-muted-foreground
            [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground/50 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0"
        />
      </div>
    </div>
  );
};

export default Tiptap;
