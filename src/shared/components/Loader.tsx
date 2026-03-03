import { Loading01 } from "@untitledui/icons"

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-2">
      <Loading01 className="size-5 transform animate-spin text-blue-primary" />
    </div>
  )
}

export default Loader