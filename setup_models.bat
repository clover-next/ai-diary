@echo off
echo Wordless-Diary AI Model Setup Script
echo -----------------------------------
echo.

set MODEL_DIR=models
if not exist %MODEL_DIR% mkdir %MODEL_DIR%

echo [1/2] Downloading Gemma-3 1B IT (LLM)...
curl -L "https://huggingface.co/lmstudio-community/gemma-3-1b-it-GGUF/resolve/main/gemma-3-1b-it-Q4_K_M.gguf" -o "%MODEL_DIR%\llm_model.gguf"

echo.
echo [2/2] Downloading Qwen3-TTS 0.6B (TTS)...
curl -L "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf" -o "%MODEL_DIR%\tts_model.gguf"

echo.
echo Finished! Please place these .gguf files in your Git repository LFS or 
echo ensure they are excluded via .gitignore (default).
echo.
pause
