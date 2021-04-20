import { mapGiftList } from 'app-libs/helpers/mapPicker';

export default function mapTotalType(ListGift) {
    
    const List = !ListGift || ListGift.length === 0 ? null : {
        Code: ListGift[0].Code,
        Name: ListGift[0].Name
    }
    
    return List;
}