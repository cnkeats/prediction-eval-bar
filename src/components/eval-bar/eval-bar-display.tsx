type EvalBarDisplayProps = {
  value: number
}

const EvalBarDisplay: React.FC<EvalBarDisplayProps> = ({ value }) => (
  <div className="flex h-screen w-fit flex-col">
    <BarPart color="#db00b3" size={100 - value}>
      Doubters
    </BarPart>
    <BarPart color="#1e69ff" size={value}>
      Believers
    </BarPart>
  </div>
)

export default EvalBarDisplay

interface BarPartProps {
  color: string
  size: number
  children: React.ReactNode
}

const BarPart: React.FC<BarPartProps> = ({ color, size, children }) => (
  <div
    className="p-2 font-bold text-white duration-1000"
    style={{ backgroundColor: color, flexGrow: size }}
  >
    {children}
  </div>
)
