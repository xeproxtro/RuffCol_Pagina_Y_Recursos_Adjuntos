/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package mintic.edu.ciclo3.backend.modelo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author Usuario
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ClienteDto {

	private Long id;
	
	private Long idTipoDocumento;

	private String numeroDocumento;

	private String nombre;

	private String direccion;

	private String telefono;
	
	private String email;    


}
