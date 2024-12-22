import { CodeEditorState } from "@/types";
import { Monaco } from "@monaco-editor/react";
import { create } from "zustand";


const getInitialState = ()=>{
    if(typeof window !== "undefined"){
        const language = localStorage.getItem("editor-language");
        const theme = localStorage.getItem("editor-theme");
        const fontSize = localStorage.getItem("editor-fontSize");
        return {
            language: language || "javascript",
            theme: theme || "vs-dark",
            fontSize: Number(fontSize) || 16
        }
    }
    return {
        language: "javascript",
        theme: "vs-dark",
        fontSize: 16
    }
}

export const useCodeEditorStore = create<CodeEditorState>((set,get)=>{
    const initialState = getInitialState();
    return {
         ...initialState,
        output: "",
        error: null,
        isRunning: false,
        editor: null,
        executionResult: null,
        
        getCode: () => get().editor?.getValue() || "",
        setEditor: (editor: Monaco) => {
            const saveCode = localStorage.getItem(`editor-code-${get().language}`);
            if (saveCode) {
                editor.setValue(saveCode);
            }
            set({ editor });
        },
        setTheme: (theme: string) => {
            localStorage.setItem("editor-theme", theme);
            set({ theme });
        },
        setLanguage: (language: string) => {
            const currentCode = get().editor?.getValue();
            if (currentCode) {
                localStorage.setItem(`editor-code-${get().language}`, currentCode);
            }
            localStorage.setItem("editor-language", language);
            set({ 
                language,
                output: "",
                error: null 
            });
        },
        setFontSize: (fontSize: number) => {
            localStorage.setItem("editor-fontSize", fontSize.toString());
            set({ fontSize });
        },
        runCode: async () => {
           // todo
        },

    }
})