import { Button } from 'react-bootstrap'
import * as XLSX from 'xlsx'
import { getFormattedDAndT } from '../../lib/getFormatedDate'

export default function JsonToExcelBtn({ jsonData, fileName }) {
  const extractFields = (item) => {
    if (item.pickUpDetails.readyTime) {
      item.pickUpDetails.readyTime = getFormattedDAndT(item.pickUpDetails.readyTime)
    }
    if (item.pickUpDetails.pickedUpTime) {
      item.pickUpDetails.pickedUpTime = getFormattedDAndT(item.pickUpDetails.pickedUpTime)
    }
    if (item.pickUpDetails.arrivalTime) {
      item.pickUpDetails.arrivalTime = getFormattedDAndT(item.pickUpDetails.arrivalTime)
    }
    if (item.dropOfDetails.arrivalTime) {
      item.dropOfDetails.arrivalTime = getFormattedDAndT(item.dropOfDetails.arrivalTime)
    }
    if (item.dropOfDetails.deliveredTime) {
      item.dropOfDetails.deliveredTime = getFormattedDAndT(item.dropOfDetails.deliveredTime)
    }

    return {
      Client: item.clientId ? item.clientId.companyName : '',
      'Ready Time': item.pickUpDetails ? item.pickUpDetails.readyTime : '',
      AWB: item.AWB || '',
      'Customer Job number': item.custRefNumber || '',
      'Service Type': item.serviceTypeId ? item.serviceTypeId.text : '',
      'Service Code': item.serviceCodeId ? item.serviceCodeId.text : '',
      Pieces: item.pieces || '',
      Weight: item.weight || '',
      'Pick up location':
        item.pickUpDetails && item.pickUpDetails.pickupLocationId
          ? item.pickUpDetails.pickupLocationId.mapName
          : '',
      'Drop off location':
        item.dropOfDetails && item.dropOfDetails.dropOfLocationId
          ? item.dropOfDetails.dropOfLocationId.mapName
          : '',
      'Arrived at pick up': item.pickUpDetails ? item.pickUpDetails.arrivalTime : '',
      'Picked Up Time': item.pickUpDetails ? item.pickUpDetails.pickedUpTime : '',
      'Arrived at delivery': item.dropOfDetails ? item.dropOfDetails.arrivalTime : '',
      'Delivered time': item.dropOfDetails ? item.dropOfDetails.deliveredTime : '',
      'Wait time charges': item.wait_time_charge || '', // Assuming waitTimeCharges exists in your data
      Notes: item.note || '',
      Rates: item.rates || '', // Assuming rates exists in your data
      'Fuel Surcharge': item.fuel_charge || '', // Assuming fuelSurcharge exists in your data
      'Invoice Number': item.invoice_number || '', // Assuming invoiceNumber exists in your data
    }
  }

  const handleClick = () => {
    // Extract fields from the JSON data
    const extractedData = jsonData.map((item) => extractFields(item))

    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Convert extracted JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(extractedData)

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // Write the workbook and trigger the download
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
  }

  return (
    <>
      <Button variant="primary" className="m-2" style={{ fontSize: '12px' }} onClick={handleClick}>
        Export to Excel
      </Button>
    </>
  )
}
