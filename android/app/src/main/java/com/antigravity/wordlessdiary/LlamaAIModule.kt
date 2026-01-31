package com.antigravity.wordlessdiary

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class LlamaAIModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    init {
        System.loadLibrary("native-lib")
    }

    override fun getName(): String {
        return "LlamaAI"
    }

    // Declare native methods implemented in C++
    external fun nativeLoadModel(modelPath: String): Boolean
    external fun nativePredict(prompt: String): String

    @ReactMethod
    fun loadModel(modelPath: String, promise: Promise) {
        try {
            val success = nativeLoadModel(modelPath)
            if (success) {
                promise.resolve(true)
            } else {
                promise.reject("LOAD_ERROR", "Failed to load model")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun predict(prompt: String, promise: Promise) {
        try {
            val result = nativePredict(prompt)
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}
