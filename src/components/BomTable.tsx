import { SupplierName } from "@tscircuit/props"
import { AnyCircuitElement } from "circuit-json"
import { Link } from "wouter"

interface BomTableProps {
  circuitJson: AnyCircuitElement[]
}

export const linkify = (supplier: string, partNumber: string) => {
  if (supplier === "jlcpcb") {
    return (
      <a
        className="underline text-blue-500"
        target="_blank"
        href={`https://jlcpcb.com/partdetail/${partNumber}`}
      >
        {partNumber}
      </a>
    )
  }
  return partNumber
}

export const BomTable: React.FC<BomTableProps> = ({ circuitJson }) => {
  const sourceComponents = circuitJson.filter(
    (el) => el.type === "source_component",
  )

  const supplierColumns = new Set<SupplierName>()
  sourceComponents.forEach((comp) => {
    if (comp.supplier_part_numbers) {
      Object.keys(comp.supplier_part_numbers).forEach((supplier) =>
        supplierColumns.add(supplier as SupplierName),
      )
    }
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-2">Name</th>
            {Array.from(supplierColumns).map((supplier) => (
              <th key={supplier} className="p-2 capitalize">
                {supplier}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sourceComponents.map((comp) => (
            <tr key={comp.source_component_id} className="border-b">
              <td className="p-2">{comp.name}</td>
              {Array.from(supplierColumns).map((supplier) => (
                <td key={supplier} className="p-2">
                  {linkify(
                    supplier,
                    comp.supplier_part_numbers?.[supplier]?.[0] || "",
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
