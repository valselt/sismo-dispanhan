#!/bin/sh

# Mulai server Ollama di background
ollama serve &

# Tunggu beberapa saat agar server siap (misal 10 detik)
sleep 10

# Unduh model-model
echo "Starting Ollama model downloads..."
ollama pull deepseek-r1:1.5b
ollama pull gemma3:4b
ollama pull llama3.2:3b
ollama pull nemotron-mini:4b
echo "Ollama model downloads finished."

# Tunggu proses Ollama serve yang berjalan di background
wait 