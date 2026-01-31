#include <jni.h>
#include <string>

// Fallback macros for IDEs that cannot find jni.h during static analysis.
// These do not affect the actual Android build process.
#ifndef JNIEXPORT
#define JNIEXPORT
#endif
#ifndef JNICALL
#define JNICALL
#endif

extern "C" JNIEXPORT jboolean JNICALL
Java_com_antigravity_wordlessdiary_LlamaAIModule_nativeLoadModel(
    JNIEnv *env, jobject /* this */, jstring modelPath) {
  const char *path = env->GetStringUTFChars(modelPath, 0);

  // TODO: llama_backend_init(false);
  // TODO: load model from 'path'

  env->ReleaseStringUTFChars(modelPath, path);
  return true; // Return true if success
}

extern "C" JNIEXPORT jstring JNICALL
Java_com_antigravity_wordlessdiary_LlamaAIModule_nativePredict(
    JNIEnv *env, jobject /* this */, jstring prompt) {
  const char *input = env->GetStringUTFChars(prompt, 0);

  // TODO: Perform inference using llama_eval / llama_decode

  std::string response = "Reflecting on: ";
  response += input;
  response += "\n(This is a response from the C++ Native Module layer. "
              "llama.cpp integration pending user model file.)";

  env->ReleaseStringUTFChars(prompt, input);
  return env->NewStringUTF(response.c_str());
}
