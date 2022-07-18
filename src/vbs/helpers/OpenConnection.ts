export const openConnection = `
Function OpenConnection(sConnectionString)
    Set objConnection = CreateObject("ADODB.Connection")
    OpenConnection = objConnection.Open(sConnectionString)
End Function`;
