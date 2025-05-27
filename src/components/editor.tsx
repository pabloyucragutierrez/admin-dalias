import { forwardRef, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface EditorProps {
  readOnly: boolean;
  className?: string;
  value?: string; // Cambiamos defaultValue por value para seguir el patrón de React
  onTextChange?: (value: string) => void; // Simplificamos la firma para recibir directamente el string
  onSelectionChange?: (...args: any[]) => void;
}

const toolbarOptions = [
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ header: 1 }, { header: 2 }],
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote"],
  ["link"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ align: [] }],
];

const Editor = forwardRef<Quill | null, EditorProps>(
  ({ readOnly, className, value, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const quillInstanceRef = useRef<Quill | null>(null);
    const isInitializedRef = useRef(false);
    const isUpdatingContentRef = useRef(false);

    // Esta función establece el contenido en el editor
    const setEditorContent = (content: string) => {
      if (!quillInstanceRef.current || isUpdatingContentRef.current) return;

      isUpdatingContentRef.current = true;
      quillInstanceRef.current.clipboard.dangerouslyPasteHTML(content);
      isUpdatingContentRef.current = false;
    };

    // Inicialización del editor
    useEffect(() => {
      const container = containerRef.current;
      if (!container || isInitializedRef.current) return;

      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );

      const quill = new Quill(editorContainer, {
        theme: "snow",
        modules: {
          toolbar: readOnly ? false : toolbarOptions,
        },
        readOnly: readOnly,
      });

      quillInstanceRef.current = quill;

      // Pasamos la referencia al exterior si se ha proporcionado
      if (ref && "current" in ref) {
        ref.current = quill;
      }

      // Configuramos los eventos
      quill.on(Quill.events.TEXT_CHANGE, () => {
        if (isUpdatingContentRef.current) return;
        if (onTextChange) {
          const html =
            editorContainer.querySelector(".ql-editor")?.innerHTML || "";
          onTextChange(html);
        }
      });

      if (onSelectionChange) {
        quill.on(Quill.events.SELECTION_CHANGE, (...args: any[]) => {
          onSelectionChange(...args);
        });
      }

      // Si tenemos valor inicial, lo establecemos
      if (value) {
        setEditorContent(value);
      }

      isInitializedRef.current = true;

      return () => {
        if (ref && "current" in ref) {
          ref.current = null;
        }
        quillInstanceRef.current = null;
        isInitializedRef.current = false;
        container.innerHTML = "";
      };
    }, []);

    // Actualizar el contenido cuando cambie la prop value
    useEffect(() => {
      if (quillInstanceRef.current && value !== undefined) {
        const currentContent =
          containerRef.current?.querySelector(".ql-editor")?.innerHTML;
        // Solo actualizamos si el contenido es diferente para evitar ciclos
        if (currentContent !== value) {
          setEditorContent(value);
        }
      }
    }, [value]);

    // Actualizar el estado de solo lectura cuando cambie
    useEffect(() => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current.enable(!readOnly);
      }
    }, [readOnly]);

    return <div className={className} ref={containerRef}></div>;
  }
);

Editor.displayName = "Editor";

export default Editor;
