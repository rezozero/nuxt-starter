import { RoadizWalker, RoadizWebResponseBlocks } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { getArrayFromCollection } from '~/utils/roadiz/get-array-from-collection'

// we have to get a hydra collection of RoadizWalker (JSON LD format),
// because if the API has been requested as JSON format then we won't be able to parse the result (lack of '@type' properties)
export function getBlockCollection(blocks: RoadizWebResponseBlocks): RoadizWalker[] {
    return getArrayFromCollection<RoadizWalker>(blocks)
}
