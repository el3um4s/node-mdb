export const getDataTypeDesc = `
Function GetDataTypeDesc( myTypeNum )
    Dim arrTypes( 8192 ), i
    For i = 0 To UBound( arrTypes )
        arrTypes( i ) = "????"
    Next
    arrTypes(0)     = "Empty"
    arrTypes(2)     = "SmallInt"
    arrTypes(3)     = "Integer"
    arrTypes(4)     = "Single"
    arrTypes(5)     = "Double"
    arrTypes(6)     = "Currency"
    arrTypes(7)     = "Date"
    arrTypes(8)     = "BSTR"
    arrTypes(9)     = "IDispatch"
    arrTypes(10)    = "Error"
    arrTypes(11)    = "Boolean"
    arrTypes(12)    = "Variant"
    arrTypes(13)    = "IUnknown"
    arrTypes(14)    = "Decimal"
    arrTypes(16)    = "TinyInt"
    arrTypes(17)    = "UnsignedTinyInt"
    arrTypes(18)    = "UnsignedSmallInt"
    arrTypes(19)    = "UnsignedInt"
    arrTypes(20)    = "BigInt"
    arrTypes(21)    = "UnsignedBigInt"
    arrTypes(64)    = "FileTime"
    arrTypes(72)    = "GUID"
    arrTypes(128)   = "Binary"
    arrTypes(129)   = "Char"
    arrTypes(130)   = "WChar"
    arrTypes(131)   = "Numeric"
    arrTypes(132)   = "UserDefined"
    arrTypes(133)   = "DBDate"
    arrTypes(134)   = "DBTime"
    arrTypes(135)   = "DBTimeStamp"
    arrTypes(136)   = "Chapter"
    arrTypes(138)   = "PropVariant"
    arrTypes(139)   = "VarNumeric"
    arrTypes(200)   = "VarChar"
    arrTypes(201)   = "LongVarChar"
    arrTypes(202)   = "VarWChar"
    arrTypes(203)   = "LongVarWChar"
    arrTypes(204)   = "VarBinary"
    arrTypes(205)   = "LongVarBinary"
    arrTypes(8192)  = "Array"
    GetDataTypeDesc = arrTypes( myTypeNum )
End Function`;
