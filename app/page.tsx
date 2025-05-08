"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, Download, RefreshCw } from "lucide-react"

export default function ImageProcessor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [brightness, setBrightness] = useState([100])
  const [contrast, setContrast] = useState([100])
  const [saturation, setSaturation] = useState([100])
  const [isProcessing, setIsProcessing] = useState(false)
  const [wasmModule, setWasmModule] = useState<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 加载 WebAssembly 模块
  useEffect(() => {
    async function loadWasm() {
      try {
        // 在实际项目中，这里会导入编译好的 .wasm 文件
        // import wasmModule from '../wasm/image_processor.wasm?module';
        // const instance = await WebAssembly.instantiate(wasmModule);
        // setWasmModule(instance.exports);

        // 由于我们无法在这里实际编译 Wasm，所以使用模拟函数
        setWasmModule({
          brighten: (data: Uint8ClampedArray, width: number, height: number, value: number) => {
            const newData = new Uint8ClampedArray(data.length)
            for (let i = 0; i < data.length; i += 4) {
              newData[i] = Math.min(255, data[i] * (value / 100)) // R
              newData[i + 1] = Math.min(255, data[i + 1] * (value / 100)) // G
              newData[i + 2] = Math.min(255, data[i + 2] * (value / 100)) // B
              newData[i + 3] = data[i + 3] // A
            }
            return newData
          },
          contrast: (data: Uint8ClampedArray, width: number, height: number, value: number) => {
            const factor = (259 * (value + 255)) / (255 * (259 - value))
            const newData = new Uint8ClampedArray(data.length)
            for (let i = 0; i < data.length; i += 4) {
              newData[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128))
              newData[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128))
              newData[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128))
              newData[i + 3] = data[i + 3]
            }
            return newData
          },
          saturate: (data: Uint8ClampedArray, width: number, height: number, value: number) => {
            const newData = new Uint8ClampedArray(data.length)
            for (let i = 0; i < data.length; i += 4) {
              // 简化的饱和度调整
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
              const factor = value / 100

              newData[i] = Math.min(255, avg + (data[i] - avg) * factor)
              newData[i + 1] = Math.min(255, avg + (data[i + 1] - avg) * factor)
              newData[i + 2] = Math.min(255, avg + (data[i + 2] - avg) * factor)
              newData[i + 3] = data[i + 3]
            }
            return newData
          },
        })
      } catch (error) {
        console.error("Failed to load WebAssembly module:", error)
      }
    }

    loadWasm()
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setOriginalImage(img.src)
        setProcessedImage(img.src)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const processImage = async () => {
    if (!originalImage || !wasmModule) return

    setIsProcessing(true)

    try {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          setIsProcessing(false)
          return
        }

        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        let data = imageData.data

        // 应用亮度
        data = wasmModule.brighten(data, canvas.width, canvas.height, brightness[0])

        // 应用对比度
        data = wasmModule.contrast(data, canvas.width, canvas.height, contrast[0])

        // 应用饱和度
        data = wasmModule.saturate(data, canvas.width, canvas.height, saturation[0])

        // 更新图像数据
        const newImageData = new ImageData(data, canvas.width, canvas.height)
        ctx.putImageData(newImageData, 0, 0)

        setProcessedImage(canvas.toDataURL("image/jpeg"))
        setIsProcessing(false)
      }
      img.src = originalImage
    } catch (error) {
      console.error("Error processing image:", error)
      setIsProcessing(false)
    }
  }

  const resetSettings = () => {
    setBrightness([100])
    setContrast([100])
    setSaturation([100])
    setProcessedImage(originalImage)
  }

  const downloadImage = () => {
    if (!processedImage) return

    const link = document.createElement("a")
    link.href = processedImage
    link.download = "processed-image.jpg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">WebAssembly 图像处理器</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>原始图像</CardTitle>
            <CardDescription>上传一张图片进行处理</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80 bg-muted/30 rounded-md">
            {originalImage ? (
              <img
                src={originalImage || "/placeholder.svg"}
                alt="Original"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">点击下方按钮上传图片</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => fileInputRef.current?.click()} className="w-full">
              选择图片
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>处理后图像</CardTitle>
            <CardDescription>应用 WebAssembly 处理后的结果</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80 bg-muted/30 rounded-md">
            {isProcessing ? (
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-2" />
                <p className="text-muted-foreground">处理中...</p>
              </div>
            ) : processedImage ? (
              <img
                src={processedImage || "/placeholder.svg"}
                alt="Processed"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">请先上传图片</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between gap-2">
            <Button onClick={downloadImage} disabled={!processedImage || isProcessing} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
            <Button
              onClick={resetSettings}
              variant="outline"
              disabled={!originalImage || isProcessing}
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              重置
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>图像调整</CardTitle>
          <CardDescription>使用 WebAssembly 调整图像参数</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="brightness" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="brightness">亮度</TabsTrigger>
              <TabsTrigger value="contrast">对比度</TabsTrigger>
              <TabsTrigger value="saturation">饱和度</TabsTrigger>
            </TabsList>
            <TabsContent value="brightness" className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>亮度: {brightness[0]}%</Label>
                </div>
                <Slider
                  value={brightness}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={setBrightness}
                  disabled={!originalImage || isProcessing}
                />
              </div>
            </TabsContent>
            <TabsContent value="contrast" className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>对比度: {contrast[0]}%</Label>
                </div>
                <Slider
                  value={contrast}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={setContrast}
                  disabled={!originalImage || isProcessing}
                />
              </div>
            </TabsContent>
            <TabsContent value="saturation" className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>饱和度: {saturation[0]}%</Label>
                </div>
                <Slider
                  value={saturation}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={setSaturation}
                  disabled={!originalImage || isProcessing}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={processImage} disabled={!originalImage || isProcessing} className="w-full">
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            应用处理
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
