import { FunctionComponent, useMemo } from "react";
import { FieldModel } from "../../pluginInterface";
import { createSlice, Slice, useSampledSlices } from "../../pluginInterface/FieldModel";
import SampledSlicesView from "./SlicedVolumeView1/SampledSlicesView";

type Props = {
    fieldModel: FieldModel
}

// const useSampledSlices = (fieldModel: FieldModel, slices: Slice[], components: string[]): SampledSlice[] | undefined => {
//     const [sampledSlices, setSampledSlices] = useState<SampledSlice[] | undefined>(undefined)
//     const ref = useRef<{fieldModel?: FieldModel, slices?: Slice[], components?: string[]}>({})
//     ref.current.fieldModel = fieldModel
//     ref.current.slices = slices
//     ref.current.components = components
//     useEffect(() => {
//         setSampledSlices(undefined)
//         sampleSlices(fieldModel, slices, fieldModel.components).then((sampledSlices) => {
//             if ((ref.current.fieldModel === fieldModel) && (ref.current.slices === slices) && (ref.current.components === components)) {
//                 setSampledSlices(sampledSlices)
//             }
//         })
//     }, [fieldModel, slices, components])
//     return sampledSlices
// }

const FieldModelSlicesView: FunctionComponent<Props> = ({fieldModel}) => {
    const slices: Slice[] = useMemo(() => {
        return [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(z => (
            createSlice({center: [0.5, 0.5, z], dx: [1/100, 0, 0], dy: [0, 1/100, 0], nx: 90, ny: 90})
        ))
    }, [])
    const sampledSlices = useSampledSlices(fieldModel, slices, fieldModel.components)
    return (
        <SampledSlicesView
            sampledSlices={sampledSlices}
        />
    )
}

export default FieldModelSlicesView